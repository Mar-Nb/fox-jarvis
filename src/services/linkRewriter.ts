const twitterLinkRegex = /https?:\/\/(www\.)?(twitter\.com|x\.com)/i;

export const rewriteLink = (link: string) => {
  if (link.match(twitterLinkRegex)) {
    return rewriteTwitter(link);
  }
};

const rewriteTwitter = (link: string) => {
  return link.replace(twitterLinkRegex, "https://vxtwitter.com");
};
