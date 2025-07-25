import { Webhook } from "svix";
import User from "../models/User.model.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.model.js";
import Course from "../models/Course.model.js";

// API controller fnc to manage clerk user with db
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
      }
      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const session = sessionList.data[0];
      if (!session || !session.metadata || !session.metadata.purchaseId) {
        console.log("Missing session or metadata");
        return response.status(400).send("Invalid session or metadata");
      }

      const { purchaseId } = session.metadata;

      try {
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.log(`Purchase not found for ID: ${purchaseId}`);
          return response.status(400).send("Purchase not found");
        }

        const userData = await User.findById(purchaseData.userId);
        if (!userData) {
          console.log(`User not found for ID: ${purchaseData.userId}`);
          return response.status(400).send("User not found");
        }

        const courseData = await Course.findById(purchaseData.courseId.toString());
        if (!courseData) {
          console.log(`Course not found for ID: ${purchaseData.courseId}`);
          return response.status(400).send("Course not found");
        }

        // Check if user is already enrolled to prevent duplicates
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();
      } catch (error) {
        console.error("Error processing payment success:", error);
        return response.status(500).send("Error processing payment");
      }

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";

      await purchaseData.save();
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};
