import React from 'react';

const Navbar = ({ cartCount, onOpenCart }) => {
	return (
		<header className="bg-indigo-600 text-white p-4">
			<div className="container mx-auto flex items-center justify-between">
				<h1 className="text-xl font-bold">Vibe Commerce — Mock Cart</h1>
				<div className="flex items-center space-x-4">
					<button
						onClick={onOpenCart}
						className="relative bg-indigo-500 hover:bg-indigo-400 px-3 py-2 rounded"
					>
						Cart
						<span className="ml-2 inline-block bg-white text-indigo-700 px-2 py-0.5 rounded-full text-sm">
							{cartCount || 0}
						</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
