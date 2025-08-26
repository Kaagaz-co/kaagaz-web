import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import introVideo from '../../video/kaagaz-intro.mp4?url';
import { setBgMusicPlaying } from '@/state/audioBus';

export default function IntroVideoOverlay({ show, onEnd }) {
	const videoRef = useRef(null);

	// Lock body scroll while overlay is visible
	useEffect(() => {
		if (!show) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [show]);

		// Allow skipping video on scroll/touch/keys (e.g., user attempts to scroll down)
		useEffect(() => {
			if (!show) return;
			const skip = (evt) => {
				// Prevent the default scroll while we dismiss
				if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
				if (videoRef.current && !videoRef.current.paused) videoRef.current.pause();
				if (typeof onEnd === 'function') onEnd();
			};
			const onWheel = (e) => skip(e);
			const onTouchMove = (e) => skip(e);
			const onKeyDown = (e) => {
				const k = e.key;
				if (k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') skip(e);
			};
			window.addEventListener('wheel', onWheel, { passive: false });
			window.addEventListener('touchmove', onTouchMove, { passive: false });
			window.addEventListener('keydown', onKeyDown, { passive: false });
			return () => {
				window.removeEventListener('wheel', onWheel);
				window.removeEventListener('touchmove', onTouchMove);
				window.removeEventListener('keydown', onKeyDown);
			};
		}, [show, onEnd]);

		useEffect(() => {
			if (!show || !videoRef.current) return;
			// Always restart from the beginning when shown
			videoRef.current.currentTime = 0;
				// Try autoplay with sound; if blocked, fall back to muted autoplay (no prompt)
					const tryPlay = async () => {
						try {
							videoRef.current.muted = false;
							await videoRef.current.play();
					} catch (_) {
						try {
							videoRef.current.muted = true;
							await videoRef.current.play();
						} catch {
							// If even muted playback fails, skip the intro rather than block UX
							if (typeof onEnd === 'function') onEnd();
						}
						}
					};
			tryPlay();
		}, [show]);

		// If user taps/clicks anywhere on overlay while muted playback is running, try to unmute
			const handlePointerDown = async () => {
			const v = videoRef.current;
			if (!v) return;
			if (!v.paused && v.muted) {
				try {
					v.muted = false;
					await v.play();
				} catch {}
			}
		};

	return (
		<AnimatePresence>
			{show && (
						<motion.div
					className="fixed inset-0 z-[9999] bg-black"
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.7 }}
							onPointerDown={handlePointerDown}
				>
					<video
						ref={videoRef}
						src={introVideo}
						className="w-screen h-screen object-cover"
						autoPlay
						controls={false}
						playsInline
						onPlay={() => setBgMusicPlaying(false)}
						onEnded={onEnd}
						onError={onEnd}
						muted={false}
					/>

					  {/* Hint: only show scroll-to-skip */}
											<div className="absolute bottom-6 inset-x-0 flex justify-center">
												<div className="flex items-center gap-2">
													<div className="px-4 py-2 rounded-full text-xs sm:text-sm text-white/80 bg-black/40 border border-white/20">
														Scroll to skip
													</div>
												</div>
											</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
