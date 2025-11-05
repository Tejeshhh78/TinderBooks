"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import { swipeBook } from "@/actions/swipe-book";
import { BookSelectionDialog } from "@/components/book-selection-dialog";
import { useRouter } from "next/navigation";

type Book = {
	id: string;
	title: string;
	author: string;
	genre: string;
	condition: "new" | "like-new" | "good" | "fair";
	coverUrl: string | null;
	description: string | null;
	ownerId: string;
	ownerName: string;
};

type UserBook = {
	id: string;
	title: string;
	author: string;
	genre: string;
	condition: "new" | "like-new" | "good" | "fair";
	coverUrl: string | null;
	description: string | null;
};

type SwipeInterfaceProps = {
	booksPromise: Promise<Book[]>;
	userBooksPromise: Promise<UserBook[]>;
};

export default function SwipeInterface({
	booksPromise,
	userBooksPromise,
}: SwipeInterfaceProps) {
	const books = use(booksPromise);
	const userBooks = use(userBooksPromise);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showBookSelection, setShowBookSelection] = useState(false);
	const [pendingLikeBookId, setPendingLikeBookId] = useState<string | null>(
		null,
	);
	const [isAnimating, setIsAnimating] = useState(false);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null,
	);
	const router = useRouter();

	const currentBook = books[currentIndex];

	useEffect(() => {
		// Reset animation after it completes
		if (isAnimating) {
			const timer = setTimeout(() => {
				setIsAnimating(false);
				setSwipeDirection(null);
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [isAnimating]);

	const handlePass = async () => {
		if (!currentBook || isAnimating) return;

		setSwipeDirection("left");
		setIsAnimating(true);

		setTimeout(async () => {
			const formData = new FormData();
			formData.append("bookId", currentBook.id);
			formData.append("direction", "pass");
			await swipeBook(formData);
			setCurrentIndex((prev) => prev + 1);
			router.refresh();
		}, 300);
	};

	const handleLike = () => {
		if (!currentBook || isAnimating) return;

		if (userBooks.length === 0) {
			alert("Please add books to your collection first in the Books page!");
			return;
		}

		setPendingLikeBookId(currentBook.id);
		setShowBookSelection(true);
	};

	const handleBookSelected = async (offeredBookId: string) => {
		if (!pendingLikeBookId) return;

		setSwipeDirection("right");
		setIsAnimating(true);
		setShowBookSelection(false);

		setTimeout(async () => {
			const formData = new FormData();
			formData.append("bookId", pendingLikeBookId);
			formData.append("direction", "like");
			formData.append("offeredBookId", offeredBookId);

			const result = await swipeBook(formData);

			if (result.match) {
				alert(
					`🎉 It's a Match! You matched with ${currentBook.ownerName || "a user"}!`,
				);
			}

			setPendingLikeBookId(null);
			setCurrentIndex((prev) => prev + 1);
			router.refresh();
		}, 300);
	};

	if (books.length === 0 || currentIndex >= books.length) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardContent className="p-8 text-center">
					<p className="text-lg text-muted-foreground">
						No more books to discover! Check back later.
					</p>
					<Button
						className="mt-4"
						onClick={() => {
							setCurrentIndex(0);
							router.refresh();
						}}
					>
						Refresh
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<div className="relative flex flex-col items-center">
				<Card
					className={`w-full max-w-md transition-all duration-300 ${
						isAnimating && swipeDirection === "left"
							? "translate-x-[-200%] opacity-0 rotate-[-30deg]"
							: isAnimating && swipeDirection === "right"
								? "translate-x-[200%] opacity-0 rotate-[30deg]"
								: ""
					}`}
				>
					<CardContent className="p-8">
						<div className="space-y-4">
							<div>
								<h2 className="text-2xl font-bold">{currentBook.title}</h2>
								<p className="text-lg text-muted-foreground">
									by {currentBook.author}
								</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground">Genre</p>
								<p className="capitalize">{currentBook.genre}</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground">Condition</p>
								<p className="capitalize">{currentBook.condition}</p>
							</div>

							<div className="pt-4 border-t">
								<p className="text-sm text-muted-foreground">Owner</p>
								<p className="font-medium">{currentBook.ownerName}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-4 mt-6">
					<Button
						size="lg"
						variant="outline"
						className="rounded-full size-16"
						onClick={handlePass}
						disabled={isAnimating}
					>
						<X className="size-8 text-destructive" />
					</Button>
					<Button
						size="lg"
						className="rounded-full size-16 bg-green-600 hover:bg-green-700"
						onClick={handleLike}
						disabled={isAnimating}
					>
						<Heart className="size-8" />
					</Button>
				</div>

				<p className="mt-6 text-sm text-muted-foreground">
					{currentIndex + 1} / {books.length}
				</p>
			</div>

			<BookSelectionDialog
				open={showBookSelection}
				onOpenChange={setShowBookSelection}
				books={userBooks}
				onSelectBook={handleBookSelected}
			/>
		</>
	);
}
