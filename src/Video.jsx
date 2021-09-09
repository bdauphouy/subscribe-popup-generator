import { Composition } from 'remotion'
import Popup from './Popup'

export const RemotionVideo = () => {
	return (
		<>
			<Composition
				id="Popup"
				component={Popup}
				durationInFrames={360}
				fps={60}
				width={1920}
				height={1080}
				defaultProps={{
					channelUrl:
						'https://www.youtube.com/channel/UCIHVyohXw6j2T-83-uLngEg',
				}}
			/>
		</>
	)
}
