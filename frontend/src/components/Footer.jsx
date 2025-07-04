const Footer = () => {
	return (
		<footer className='py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='flex flex-col h-full items-center justify-left gap-4 md:h-24 md:flex-row'>
				<p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
					Built by{" "}
					<a
						href='https://github.com/LFroesch'
						target='_blank'
						className='font-medium underline underline-offset-4'
					>
						Lucas
					</a>
					. The source code is available on{" "}
					<a
						href='https://github.com/LFroesch'
						target='_blank'
						rel='noreferrer'
						className='font-medium underline underline-offset-4'
					>
						GitHub
					</a>
					. <br/>
					<strong>DISCLAIMER:</strong> This project is for <strong>EDUCATIONAL PURPOSES ONLY.</strong>
                    <br/>
                    It is ran using the <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className='font-medium underline underline-offset-4'>PokeAPI</a> and does not use any copyrighted assets from the Pokémon franchise.          
				</p>
			</div>
		</footer>
	);
};
export default Footer;