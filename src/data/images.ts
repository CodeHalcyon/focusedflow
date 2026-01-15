export interface Image {
    id: string;
    url: string;
}

export const images: Image[] = [
    // Streak achievements
    {
        id: 'img01',
        url: 'https://i.pinimg.com/736x/c0/aa/ce/c0aace6406926099606ec466351470c2.jpg',
    },
    {
        id:'img02',
        url:'https://i.pinimg.com/474x/b4/c9/17/b4c917c330bc17ba365e0421c635f573.jpg'
    },
    {
        id:'img03',
        url:'https://i.pinimg.com/736x/b7/f2/5a/b7f25a8d26191dbe7b193e6a70d4708d.jpg'
    },
    {
        id:'img04',
        url:'https://i.pinimg.com/736x/95/3f/6b/953f6bfb2bd035bc24fb78542e87b63e.jpg'
    },
    {
        id:'img05',
        url:'https://i.pinimg.com/736x/4d/d6/86/4dd686c595211665d1e4c40dd78b37ca.jpg'
    }
];

export function getDailyImages(): Image {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const index = dayOfYear % images.length;
    return images[index];
  }
  