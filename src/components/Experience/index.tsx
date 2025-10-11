import HighlightedHeader from "../ui/highlightedheader";
import ExperiencesList from "./ExperiencesList";

function Experience() {
    return (
        <section className="flex flex-col gap-2">
            <HighlightedHeader>
                <h2 className="text-lg text-secondary-foreground font-bold">
                    experience
                </h2>
            </HighlightedHeader>
            <ExperiencesList />
        </section>
    );
}

export default Experience;