import { Button } from "./ui/button";

function Header() {
	return (
		<div className=" flex justify-end items-center py-4 pl-4">
			<div className="flex gap-2">
				<Button variant="link" asChild>
					<a href="/">Home</a>
				</Button>
				<Button variant="link" asChild>
					<a href="/blog">Blog</a>
				</Button>
			</div>
		</div>
	);
}

export default Header;
