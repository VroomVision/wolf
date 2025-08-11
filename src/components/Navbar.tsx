"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Niche ke imports apne project ke hisaab se adjust karen
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const navItems = [
	{ label: "Features", path: "#", scrollId: "before-after" },
	{ label: "Products", path: "/products" },
	{ label: "Reviews", path: "#", scrollId: "reviews" },
];


const Navbar: React.FC = () => {
	const router = useRouter();
	const { cart } = useCart();
	const [scrolled, setScrolled] = useState(false);
	const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
	const [showCard, setShowCard] = useState(false);

	useEffect(() => {
		if (pendingScrollId && window.location.pathname === '/') {
			setTimeout(() => {
				const el = document.getElementById(pendingScrollId);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
				setPendingScrollId(null);
			}, 400);
		}
	}, [pendingScrollId]);

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, scrollId?: string) => {
		if (scrollId) {
			e.preventDefault();
			if (window.location.pathname === '/') {
				const el = document.getElementById(scrollId);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			} else {
				setPendingScrollId(scrollId);
				router.push('/');
			}
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);


		return (
			<>
				<nav
					className={`w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] z-50 px-10 flex items-center transition-all duration-300 border-b border-white/10 ${
						scrolled ? "backdrop-blur-sm" : "backdrop-blur"
					}`}
				>
					{/* Logo with click handler for desktop only */}
					<div className="h-auto w-auto flex flex-row items-center group cursor-pointer select-none hidden md:flex" onClick={() => setShowCard(true)}>
						<Logo />
					</div>
					{/* Mobile: keep as link */}
					<Link href="/" className="h-auto w-auto flex flex-row items-center group md:hidden">
						<Logo />
					</Link>
					<div className="flex-1 flex justify-center">
						<div className="flex items-center justify-center w-[420px] h-auto border border-[#7042f861] bg-[#0300145e] px-[20px] py-[10px] rounded-full text-gray-200 gap-16 -ml-32">
							{navItems.map((item) => (
								<a
									key={item.label}
									href={item.path}
									className="cursor-pointer text-lg font-medium transition-colors duration-200 hover:text-purple-400"
									onClick={e => handleNavClick(e, item.path, item.scrollId)}
								>
									{item.label}
								</a>
							))}
						</div>
					</div>
					<div className="flex items-center space-x-3 ml-auto z-10">
						<a
							href="https://www.instagram.com/vroom_visionsx?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-purple-400 transition-colors"
						>
							<Instagram size={22} />
						</a>
						<Button
							variant="ghost"
							className="relative text-white hover:bg-purple-500/20 px-3 py-1 rounded-full"
							onClick={() => setShowCard(true)}
						>
							<ShoppingCart size={22} />
							{cart.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">
									{cart.length}
								</span>
							)}
						</Button>
					</div>
				</nav>

				{/* Slide-in card section (desktop only) */}
				<AnimatePresence>
					{showCard && (
						<motion.div
							initial={{ x: 400, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 400, opacity: 0 }}
							transition={{ type: "spring", stiffness: 400, damping: 40 }}
							className="fixed top-0 right-0 h-full w-[340px] bg-[#1a1333] shadow-2xl z-[100] border-l border-white/10 rounded-l-2xl p-6 hidden md:block"
						>
							<div className="flex justify-between items-center mb-6">
								<span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-geist-mono), Geist Mono, monospace', letterSpacing: '0.04em' }}>Cart</span>
								<button className="text-white hover:text-purple-400 text-2xl" onClick={() => setShowCard(false)}>&times;</button>
							</div>
											{/* Cart content: show empty message if cart is empty */}
															{/* Force show empty cart message for testing */}
															<div className="flex flex-col items-center justify-center h-[60vh]">
																<span className="text-white/70 text-lg font-semibold" style={{fontFamily: 'var(--font-geist-sans), Geist, sans-serif'}}>YOUR CART IS EMPTY</span>
															</div>
						</motion.div>
					)}
				</AnimatePresence>
			</>
		);
};

export default Navbar;
