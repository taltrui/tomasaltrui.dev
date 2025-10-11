import { IconPoint, IconPointFilled } from "@tabler/icons-react";

function Description({ description }: { description: { company: string, location: string, experiences: { id: string, title: string, startDate: string, endDate: string, responsibilities: { id: string, description: string }[] }[], technologies: string[] } }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <h3 className="text-xl font-bold">{description.company}</h3>
                <p className="text-md text-muted-foreground">{description.location}</p>
            </div>
            {description.experiences.map((experience) => (
                <div key={experience.id} className="relative">
                    <div className="flex items-center gap-2">
                        <IconPointFilled />
                        <h4 className="text-lg font-bold">{experience.title}</h4>
                    </div>
                    <div className="flex flex-col gap-1 ml-8">
                        <h5 className="text-sm text-muted-foreground">{experience.startDate} - {experience.endDate}</h5>
                        <ul className="flex flex-col gap-1">
                            {experience.responsibilities.map((responsibility) => (
                                <li key={responsibility.id} className="text-md flex gap-2"><IconPoint className="flex-shrink-0 size-4 mt-1" />{responsibility.description}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Description;