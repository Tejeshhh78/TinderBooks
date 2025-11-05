import { getBooksForSwipe, getUserHaveBooks } from "@/lib/swipe-queries";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import SwipeInterface from "./_components/swipe-interface";

export default async function SwipePage() {
const user = await getCurrentUser();
if (!user) {
redirect("/login");
}

const booksToSwipePromise = getBooksForSwipe(user.id);
const userBooksPromise = getUserHaveBooks(user.id);

return (
<div className="container mx-auto px-4 py-8">
<div className="max-w-2xl mx-auto">
<h1 className="text-3xl font-bold mb-6 text-center">
Discover Books
</h1>
<SwipeInterface
booksPromise={booksToSwipePromise}
userBooksPromise={userBooksPromise}
/>
</div>
</div>
);
}
