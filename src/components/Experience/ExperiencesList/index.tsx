
import { IconPoint } from '@tabler/icons-react';
import { IconPointFilled } from '@tabler/icons-react';
import { jobs } from './constants';
import Description from './Description';

function ExperiencesList() {
    return (
        <div className="flex flex-col gap-6 mt-2">
            {jobs.map((job) => (
                <Description description={job} key={job.company} />
            ))}
        </div>
    );
}

export default ExperiencesList;