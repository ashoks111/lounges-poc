import { useRef } from "react";
import classNames from 'classnames';
import Video from "./video";
import { DEFAULT_ASPECT_RATIO } from "../../../constants";

const VideoTile = ({participant, update, mirrored = true}) => {
    const videoRef = useRef(null);
    const videoFit = 'contain';
    const aspectRatio =  DEFAULT_ASPECT_RATIO;

    const cx = classNames('tile', videoFit, {
        mirrored,
        avatar:  !participant?.video?.persistentTrack,
        screenShare: participant.isScreenShare,
        active: participant.isActiveSpeaker,
      });

    return (
        <div className={cx}>
            <div className="content">
                <div className="name">
                    {participant.user_name}
                </div>
                <Video 
                    ref={videoRef}
                    participantId={participant?.user_id}
                    videoTrack={participant?.video?.persistentTrack}
                    update={update}
                />
            </div>
            <style jsx>{`
          .tile .content {
            padding-bottom: ${100 / aspectRatio}%;
          }
        `}</style>
        <style jsx>{`
          .tile {
            background: var(--blue-dark);
            min-width: 1px;
            overflow: hidden;
            position: relative;
            width: 100%;
            box-sizing: border-box;
          }

          .tile.active:before {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            left: 0px;
            bottom: 0px;
            border: 2px solid var(--primary-default);
            box-sizing: border-box;
            pointer-events: none;
            z-index: 2;
          }

          .tile .name {
            position: absolute;
            bottom: 0px;
            display: flex;
            align-items: center;
            left: 0px;
            z-index: 2;
            line-height: 1;
            font-size: 0.875rem;
            color: white;
            font-weight: var(--weight-medium);
            padding: var(--spacing-xxs);
            text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.45);
            gap: var(--spacing-xxs);
          }

          .tile .name :global(svg) {
            color: var(--red-default);
          }

          .tile.small .name {
            font-size: 12px;
          }

          .tile :global(video) {
            height: calc(100% + 4px);
            left: -2px;
            object-position: center;
            position: absolute;
            top: -2px;
            width: calc(100% + 4px);
            z-index: 1;
          }

          .tile.contain :global(video) {
            object-fit: contain;
          }

          .tile.cover :global(video) {
            object-fit: cover;
          }

          .tile.mirrored :global(video) {
            transform: scale(-1, 1);
          }

          .tile .avatar {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
        </div>
    )
}
export default VideoTile;