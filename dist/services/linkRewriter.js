const twitterLinkRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)/i;
const instaLinkRegex = /^(https?:\/\/)?(www\.)?instagram\.com/i;
const tiktokLinkRegex = /^(https?:\/\/)?(www\.)?([A-z]*\.)?tiktok\.com/i;
export const rewriteLink = (link) => {
    if (link.match(twitterLinkRegex)) {
        return rewriteTwitter(link);
    }
    if (link.match(instaLinkRegex)) {
        return rewriteInsta(link);
    }
    if (link.match(tiktokLinkRegex)) {
        return rewriteTiktok(link);
    }
};
const rewriteTwitter = (link) => {
    return link.replace(twitterLinkRegex, "https://vxtwitter.com");
};
const rewriteInsta = (link) => {
    // Profil link are not handled by ddinstagram
    if (link.includes("/p/") || link.includes("/reel/")) {
        return link;
    }
    return link.replace(instaLinkRegex, "https://ddinstagram.com");
};
const rewriteTiktok = (link) => {
    return link
        .replace(tiktokLinkRegex, "https://tnktok.com")
        .concat("?isDirect=true");
};
