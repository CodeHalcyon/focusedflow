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
    },
    {
        id:'img06',
        url:'https://i.pinimg.com/736x/dd/16/50/dd16506ae1c514eeac1fda2d5118a294.jpg'
    },
    {
        id:'img07',
        url:'https://i.pinimg.com/736x/64/4e/fc/644efcc5ccacfe7c385d3de09ad44769.jpg'
    },
    {
        id:'img08',
        url:'https://i.pinimg.com/736x/06/e0/2c/06e02cb65ab5bb1ef5a711c72e76f22a.jpg'
    },
    {
        id:'img09',
        url:'https://i.pinimg.com/1200x/12/ce/8a/12ce8ac1fe5ae0e224764982cb0c926a.jpg',
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
  