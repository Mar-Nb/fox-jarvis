const twitterLinkRegex = /https?:\/\/(www\.)?(twitter\.com|x\.com)/i;
const instaLinkRegex = /(https?:\/\/)?(www\.)?instagram\.com/i;

export const rewriteLink = (link: string) => {
  if (link.match(twitterLinkRegex)) {
    return rewriteTwitter(link);
  }

  if (link.match(instaLinkRegex)) {
    return rewriteInsta(link);
  }
};

const rewriteTwitter = (link: string) => {
  return link.replace(twitterLinkRegex, "https://vxtwitter.com");
};

const rewriteInsta = (link: string) => {
  return link.replace(instaLinkRegex, "https://ddinstagram.com");
};