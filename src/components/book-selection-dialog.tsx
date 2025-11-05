"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Book = {
	id: string;
	title: string;
	author: string;
};

type BookSelectionDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	books: Book[];
	onSelectBook: (bookId: string) => void;
};

export function BookSelectionDialog({
	open,
	onOpenChange,
	books,
	onSelectBook,
}: BookSelectionDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select a Book to Offer</DialogTitle>
					<DialogDescription>
						Choose which book from your collection you'd like to offer for this
						swap.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[400px] overflow-y-auto pr-4">
					<div className="space-y-2">
						{books.map((book) => (
							<Button
								key={book.id}
								variant="outline"
								className="w-full justify-start text-left h-auto py-3 px-4"
								onClick={() => onSelectBook(book.id)}
							>
								<div>
									<p className="font-medium">{book.title}</p>
									<p className="text-sm text-muted-foreground">{book.author}</p>
								</div>
							</Button>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
