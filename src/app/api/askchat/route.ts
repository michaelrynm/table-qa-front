import query from "@/src/lib/queryApi";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { Message } from "@/type";
import { adminDB } from "@/firebaseAdmin";

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();

  const { prompt, id, model, session, loadingMessageId } = await reqBody;

  try {
    if (!prompt) {
      return NextResponse.json(
        {
          message: "Please provide a prompt!",
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          message: "Please provide a valid chat ID!",
        },
        { status: 400 }
      );
    }

    // Get ChatGPT Response
    const response = await query(prompt, id, model);

    const responseText =
      response || "ChatGPT was unable to find an answer for that!";

    // PERUBAHAN: Jika ada loadingMessageId, update message yang sudah ada
    if (loadingMessageId) {
      // Update loading message dengan response sebenarnya
      await adminDB
        .collection("users")
        .doc(session)
        .collection("chats")
        .doc(id)
        .collection("messages")
        .doc(loadingMessageId)
        .update({
          text: responseText,
          isLoading: false, // Set loading ke false
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } else {
      // FALLBACK: Jika tidak ada loadingMessageId, buat message baru (untuk backward compatibility)
      const message: Message = {
        text: responseText,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        user: {
          _id: "ChatGPT",
          name: "ChatGPT",
          avatar:
            "https://res.cloudinary.com/duehd78sl/image/upload/v1729227742/logoLight_amxdpz.png",
        },
      };

      // Save chat from ChatGPT
      await adminDB
        .collection("users")
        .doc(session)
        .collection("chats")
        .doc(id)
        .collection("messages")
        .add(message);
    }

    return NextResponse.json(
      {
        answer: responseText,
        message: "ChatGPT has responded!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in askchat API:", error);

    // PERUBAHAN: Jika terjadi error dan ada loadingMessageId, update dengan error message
    if (loadingMessageId) {
      try {
        await adminDB
          .collection("users")
          .doc(session)
          .collection("chats")
          .doc(id)
          .collection("messages")
          .doc(loadingMessageId)
          .update({
            text: "Sorry, something went wrong. Please try again.",
            isLoading: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      } catch (updateError) {
        console.error("Error updating loading message:", updateError);
      }
    }

    return NextResponse.json(
      {
        error: "Something went wrong",
        message: "Failed to get response from ChatGPT",
        success: false,
      },
      { status: 500 }
    );
  }
};
