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
			/>
		</>
	)
}
