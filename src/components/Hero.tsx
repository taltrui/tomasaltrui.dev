import { IconBrandGithub } from '@tabler/icons-react';
import { Button } from "./ui/button";
import { IconBrandLinkedin } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconMapPin } from '@tabler/icons-react';
import HighlightedHeader from './ui/highlightedheader';

function Hero() {
    return (
        <section className="relative z-20 flex flex-col gap-2">
            <HighlightedHeader>
                <h1 className="text-4xl font-bold text-secondary-foreground">tomas altrui</h1>
            </HighlightedHeader>

            <div className="bg-secondary p-2 rounded-sm">
                <h2 className="text-lg text-secondary-foreground">
                    software engineer
                </h2>
            </div>
            <div className="flex gap-4 mt-4 flex-col">
                <div className="flex items-center gap-2">
                    <IconBrandGithub className="w-6 h-6" />
                    <Button variant="link" className="p-0 h-0">
                        <a href="https://github.com/taltrui" target="_blank" rel="noopener noreferrer">
                            /taltrui
                        </a>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <IconBrandLinkedin className="w-6 h-6" />
                    <Button variant="link" className="p-0 h-0">
                        <a href="https://www.linkedin.com/in/tomas-altrui/" target="_blank" rel="noopener noreferrer">
                            /in/tomas-altrui
                        </a>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <IconMapPin className="w-6 h-6" />
                    <p className='text-sm'>Buenos Aires, Argentina</p>
                </div>
                <div className="flex items-center gap-2">
                    <IconMail className="w-6 h-6" />
                    <Button variant="link" className="p-0 h-0">
                        <a href="mailto:hello@tomasaltrui.dev" target="_blank" rel="noopener noreferrer">
                            hello@tomasaltrui.dev
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default Hero;