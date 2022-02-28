// import { useEffect } from "react";

// const Video = ({participantId, videoTrack, videoEl}) => {
//     useEffect(() => {
//         const video = videoEl.current;
//         if(!video || !videoTrack) return;
//         video.srcObject = new MediaStream([videoTrack])

//     }, [videoEl, videoTrack])
//     return <video autoPlay ref={videoEl} />
// }
// export default Video;


import React, { useMemo, forwardRef, memo, useEffect } from 'react';
import { shallowEqualObjects } from 'shallow-equal';

export const Video = memo(
  forwardRef(({ participantId, videoTrack, update, ...rest }, videoEl ) => {
    /**
     * Memo: Chrome >= 92?
     * See: https://bugs.chromium.org/p/chromium/issues/detail?id=1232649
     */
    // const isChrome92 = useMemo(() => {
    //   const { browser, platform, os } = Bowser.parse(navigator.userAgent);
    //   return (
    //     browser.name === 'Chrome' &&
    //     parseInt(browser.version, 10) >= 92 &&
    //     (platform.type === 'desktop' || os.name === 'Android')
    //   );
    // }, []);

    /**
     * Effect: Umount
     * Note: nullify src to ensure media object is not counted
     */
    useEffect(() => {
      const video = videoEl.current;
      console.log('v1',video, videoTrack)
      if (!video) return false;
      // clean up when video renders for different participant
      video.srcObject = null;
     // if (isChrome92) video.load();
      return () => {
        // clean up when unmounted
        video.srcObject = null;
       // if (isChrome92) video.load();
      };
    }, [videoEl, participantId]);

    /**
     * Effect: mount source (and force load on Chrome)
     */
    useEffect(() => {
      const video = videoEl.current;
      console.log('v2',video, videoTrack)
      if (!video || !videoTrack) return;
      video.srcObject = new MediaStream([videoTrack]);
     // if (isChrome92) video.load();
    }, [videoEl, videoTrack]);

    return <video autoPlay ref={videoEl} id={participantId} {...rest} />;
  }),
  (p, n) => shallowEqualObjects(p, n)
);

Video.displayName = 'Video';



export default Video;
