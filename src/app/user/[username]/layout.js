export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `${username} - GitView GitHub Profile`,
    description: `View ${username}'s GitHub profile, repositories, contribution graph, and top languages on GitView.`,
    openGraph: {
      title: `${username} - GitView GitHub Profile`,
      description: `Explore ${username}'s GitHub profile, visualize their tech stack, and generate a beautiful profile card.`,
      url: `https://gitview.app/user/${username}`,
      type: 'profile',
      images: [
        {
          url: `https://github.com/${username}.png`,
          width: 400,
          height: 400,
          alt: `${username}'s GitHub Avatar`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${username} - GitView GitHub Profile`,
      description: `View ${username}'s GitHub profile, repositories, and contribution graph on GitView.`,
      images: [`https://github.com/${username}.png`],
    },
  };
}

export default function UserLayout({ children }) {
  return children;
}
