// Utility function to convert YouTube URLs to embed format
export const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))((\w|-){11})(?:\S+)?/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url;
  };
  
  // Utility function to convert Vimeo URLs to embed format
  export const getVimeoEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    return videoIdMatch ? `https://player.vimeo.com/video/${videoIdMatch[1]}` : url;
  };

 