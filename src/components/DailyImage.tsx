import { getDailyImages } from '@/data/images';

export function DailyImage() {
    const image = getDailyImages();

    return (
        <div className="animate-fade-in text-center max-w-lg mx-auto">
            <img src={image.url} alt={image.id} />
        </div>
    );
}
