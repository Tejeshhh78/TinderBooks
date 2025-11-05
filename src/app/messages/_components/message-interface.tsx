"use client";"use client";"use client";"use client";



import { use, useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";import { use, useState, useRef, useEffect } from "react";

import { sendMessage } from "@/actions/send-message";

import { useRouter } from "next/navigation";import { Button } from "@/components/ui/button";

import { Send } from "lucide-react";

import { Input } from "@/components/ui/input";import { use, useState, useRef, useEffect } from "react";import { use, useState, useRef, useEffect } from "react";

type Message = {

	id: string;import { sendMessage } from "@/actions/send-message";

	content: string;

	senderId: string;import { useRouter } from "next/navigation";import { Button } from "@/components/ui/button";import { Button } from "@/components/ui/button";

	createdAt: Date;

	read: boolean;import { Send } from "lucide-react";

	senderName: string;

	senderImage: string | null;import { Input } from "@/components/ui/input";import { Input } from "@/components/ui/input";

};

type Message = {

type MessageInterfaceProps = {

	matchId: string;	id: string;import { sendMessage } from "@/actions/send-message";import { sendMessage } from "@/actions/send-message";

	currentUserId: string;

	messagesPromise: Promise<Message[]>;	content: string;

};

	senderId: string;import { useRouter } from "next/navigation";import { useRouter } from "next/navigation";

export default function MessageInterface({

	matchId,	createdAt: Date;

	currentUserId,

	messagesPromise,	read: boolean;import { Send } from "lucide-react";import { Send } from "lucide-react";

}: MessageInterfaceProps) {

	const initialMessages = use(messagesPromise);	senderName: string;

	const [messages, setMessages] = useState(initialMessages);

	const [content, setContent] = useState("");	senderImage: string | null;

	const [isSubmitting, setIsSubmitting] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);};

	const router = useRouter();

type Message = {type Message = {

	useEffect(() => {

		if (scrollRef.current) {type MessageInterfaceProps = {

			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

		}	matchId: string;	id: number;id: number;

	}, [messages]);

	currentUserId: string;

	const handleSubmit = async (e: React.FormEvent) => {

		e.preventDefault();	messagesPromise: Promise<Message[]>;	content: string;content: string;

		if (!content.trim() || isSubmitting) return;

};

		setIsSubmitting(true);

	senderId: string;senderId: string;

		try {

			const formData = new FormData();export default function MessageInterface({

			formData.append("matchId", matchId);

			formData.append("content", content);	matchId,	createdAt: Date;createdAt: Date;



			await sendMessage(formData);	currentUserId,



			setContent("");	messagesPromise,};};

			router.refresh();

		} catch (error) {}: MessageInterfaceProps) {

			console.error("Failed to send message:", error);

			alert("Failed to send message. Please try again.");	const initialMessages = use(messagesPromise);

		} finally {

			setIsSubmitting(false);	const [messages, setMessages] = useState(initialMessages);

		}

	};	const [content, setContent] = useState("");type MessageInterfaceProps = {type MessageInterfaceProps = {



	return (	const [isSubmitting, setIsSubmitting] = useState(false);

		<div className="flex flex-col h-[500px]">

			<div className="flex-1 overflow-y-auto pr-4" ref={scrollRef}>	const scrollRef = useRef<HTMLDivElement>(null);	matchId: string;matchId: number;

				<div className="space-y-4 pb-4">

					{messages.length === 0 ? (	const router = useRouter();

						<p className="text-center text-muted-foreground">

							No messages yet. Start the conversation!	currentUserId: string;currentUserId: string;

						</p>

					) : (	useEffect(() => {

						messages.map((message) => {

							const isOwn = message.senderId === currentUserId;		if (scrollRef.current) {	messagesPromise: Promise<Message[]>;messagesPromise: Promise<Message[]>;

							return (

								<div			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

									key={message.id}

									className={`flex ${isOwn ? "justify-end" : "justify-start"}`}		}};};

								>

									<div	}, [messages]);

										className={`max-w-[70%] rounded-lg px-4 py-2 ${

											isOwn

												? "bg-primary text-primary-foreground"

												: "bg-muted"	const handleSubmit = async (e: React.FormEvent) => {

										}`}

									>		e.preventDefault();export default function MessageInterface({export default function MessageInterface({

										<p>{message.content}</p>

										<p		if (!content.trim() || isSubmitting) return;

											className={`text-xs mt-1 ${

												isOwn	matchId,matchId,

													? "text-primary-foreground/70"

													: "text-muted-foreground"		setIsSubmitting(true);

											}`}

										>	currentUserId,currentUserId,

											{new Date(message.createdAt).toLocaleTimeString([], {

												hour: "2-digit",		try {

												minute: "2-digit",

											})}			const formData = new FormData();	messagesPromise,messagesPromise,

										</p>

									</div>			formData.append("matchId", matchId);

								</div>

							);			formData.append("content", content);}: MessageInterfaceProps) {}: MessageInterfaceProps) {

						})

					)}

				</div>

			</div>			await sendMessage(formData);	const initialMessages = use(messagesPromise);const initialMessages = use(messagesPromise);



			<form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">

				<Input

					value={content}			setContent("");	const [messages, setMessages] = useState(initialMessages);const [messages, setMessages] = useState(initialMessages);

					onChange={(e) => setContent(e.target.value)}

					placeholder="Type a message..."			router.refresh();

					disabled={isSubmitting}

					className="flex-1"		} catch (error) {	const [content, setContent] = useState("");const [content, setContent] = useState("");

				/>

				<Button type="submit" disabled={isSubmitting || !content.trim()}>			console.error("Failed to send message:", error);

					<Send className="size-4" />

				</Button>			alert("Failed to send message. Please try again.");	const [isSubmitting, setIsSubmitting] = useState(false);const [isSubmitting, setIsSubmitting] = useState(false);

			</form>

		</div>		} finally {

	);

}			setIsSubmitting(false);	const scrollRef = useRef<HTMLDivElement>(null);const scrollRef = useRef<HTMLDivElement>(null);


		}

	};	const router = useRouter();const router = useRouter();



	return (

		<div className="flex flex-col h-[500px]">

			<div className="flex-1 overflow-y-auto pr-4" ref={scrollRef}>	useEffect(() => {useEffect(() => {

				<div className="space-y-4 pb-4">

					{messages.length === 0 ? (		if (scrollRef.current) {if (scrollRef.current) {

						<p className="text-center text-muted-foreground">

							No messages yet. Start the conversation!			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

						</p>

					) : (		}}

						messages.map((message) => {

							const isOwn = message.senderId === currentUserId;	}, [messages]);}, [messages]);

							return (

								<div

									key={message.id}

									className={`flex ${isOwn ? "justify-end" : "justify-start"}`}	const handleSubmit = async (e: React.FormEvent) => {const handleSubmit = async (e: React.FormEvent) => {

								>

									<div		e.preventDefault();e.preventDefault();

										className={`max-w-[70%] rounded-lg px-4 py-2 ${

											isOwn		if (!content.trim() || isSubmitting) return;if (!content.trim() || isSubmitting) return;

												? "bg-primary text-primary-foreground"

												: "bg-muted"

										}`}

									>		setIsSubmitting(true);setIsSubmitting(true);

										<p>{message.content}</p>

										<p

											className={`text-xs mt-1 ${

												isOwn		try {try {

													? "text-primary-foreground/70"

													: "text-muted-foreground"			const formData = new FormData();const formData = new FormData();

											}`}

										>			formData.append("matchId", matchId);formData.append("matchId", matchId.toString());

											{new Date(message.createdAt).toLocaleTimeString([], {

												hour: "2-digit",			formData.append("content", content);formData.append("content", content);

												minute: "2-digit",

											})}

										</p>

									</div>			await sendMessage(formData);await sendMessage(formData);

								</div>

							);

						})

					)}			const newMessage: Message = {const newMessage: Message = {

				</div>

			</div>				id: Date.now(),id: Date.now(),



			<form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">				content,content,

				<Input

					value={content}				senderId: currentUserId,senderId: currentUserId,

					onChange={(e) => setContent(e.target.value)}

					placeholder="Type a message..."				createdAt: new Date(),createdAt: new Date(),

					disabled={isSubmitting}

					className="flex-1"			};};

				/>

				<Button type="submit" disabled={isSubmitting || !content.trim()}>			setMessages((prev) => [...prev, newMessage]);setMessages((prev) => [...prev, newMessage]);

					<Send className="size-4" />

				</Button>			setContent("");setContent("");

			</form>

		</div>

	);

}			router.refresh();router.refresh();


		} catch (error) {} catch (error) {

			console.error("Failed to send message:", error);console.error("Failed to send message:", error);

			alert("Failed to send message. Please try again.");alert("Failed to send message. Please try again.");

		} finally {} finally {

			setIsSubmitting(false);setIsSubmitting(false);

		}}

	};};



	return (return (

		<div className="flex flex-col h-[500px]"><div className="flex flex-col h-[500px]">

			<div className="flex-1 overflow-y-auto pr-4" ref={scrollRef}><div className="flex-1 overflow-y-auto pr-4" ref={scrollRef}>

				<div className="space-y-4 pb-4"><div className="space-y-4 pb-4">

					{messages.length === 0 ? ({messages.length === 0 ? (

						<p className="text-center text-muted-foreground"><p className="text-center text-muted-foreground">

							No messages yet. Start the conversation!No messages yet. Start the conversation!

						</p></p>

					) : () : (

						messages.map((message) => {messages.map((message) => {

							const isOwn = message.senderId === currentUserId;const isOwn = message.senderId === currentUserId;

							return (return (

								<div<div

									key={message.id}key={message.id}

									className={`flex ${isOwn ? "justify-end" : "justify-start"}`}className={"flex }

								>>

									<div<div

										className={`max-w-[70%] rounded-lg px-4 py-2 ${className={"max-w-[70%] rounded-lg px-4 py-2 }

											isOwn>

												? "bg-primary text-primary-foreground"<p>{message.content}</p>

												: "bg-muted"<p

										}`}className={"text-xs mt-1 isOwn ? "text-primary-foreground/70" : "text-muted-foreground"

									>}}

										<p>{message.content}</p>>

										<p{new Date(message.createdAt).toLocaleTimeString([], {

											className={`text-xs mt-1 ${hour: "2-digit",

												isOwnminute: "2-digit",

													? "text-primary-foreground/70"})}

													: "text-muted-foreground"</p>

											}`}</div>

										></div>

											{new Date(message.createdAt).toLocaleTimeString([], {);

												hour: "2-digit",})

												minute: "2-digit",)}

											})}</div>

										</p></div>

									</div>

								</div><form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">

							);<Input

						})value={content}

					)}onChange={(e) => setContent(e.target.value)}

				</div>placeholder="Type a message..."

			</div>disabled={isSubmitting}

className="flex-1"

			<form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">/>

				<Input<Button type="submit" disabled={isSubmitting || !content.trim()}>

					value={content}<Send className="size-4" />

					onChange={(e) => setContent(e.target.value)}</Button>

					placeholder="Type a message..."</form>

					disabled={isSubmitting}</div>

					className="flex-1");

				/>}

				<Button type="submit" disabled={isSubmitting || !content.trim()}>
					<Send className="size-4" />
				</Button>
			</form>
		</div>
	);
}
