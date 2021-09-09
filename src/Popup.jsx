import { useEffect, useState } from 'react'
import {
	useCurrentFrame,
	useVideoConfig,
	spring,
	Sequence,
	interpolate,
	Easing,
	Img,
	Audio,
} from 'remotion'
import './fonts/roboto.css'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Cursor from './images/cursor.svg'
import clickSound from './audio/click-sound.mp3'
import bellSound from './audio/bell-sound.mp3'

const Popup = ({ channelUrl }) => {
	const frame = useCurrentFrame()
	const { fps } = useVideoConfig()

	const [notifications, setNotifications] = useState(false)
	const [subscribed, setSubscribed] = useState(false)
	const [thumbUp, setThumbUp] = useState(false)
	const [profilePicture, setProfilePicture] = useState(null)

	useEffect(() => {
		if (frame < 140) {
			setThumbUp(false)
		} else {
			setThumbUp(true)
		}

		if (frame < 210) {
			setSubscribed(false)
		} else {
			setSubscribed(true)
		}

		if (frame < 280) {
			setNotifications(false)
		} else {
			setNotifications(true)
		}
	}, [frame])

	useEffect(() => {
		fetch(
			`https://youtube-channel-thumbnail-and-name-api.ggio.fr/?channel_url=${channelUrl}`,
			{
				method: 'GET',
			}
		)
			.then((res) => res.json())
			.then((data) => setProfilePicture(data.img))
	}, [])

	const triggers = {
		box: 0,
		profilePicture: 20,
		subscribe: 30,
		bell: 40,
		thumbUp: 50,
		thumbDown: 60,
	}

	let boxAppear,
		profilePictureAppear,
		subscribeAppear,
		bellAppear,
		thumbUpAppear,
		thumbDownAppear

	const appears = {
		box: boxAppear,
		profilePicture: profilePictureAppear,
		subscribe: subscribeAppear,
		bell: bellAppear,
		thumbUp: thumbUpAppear,
		thumbDown: thumbDownAppear,
	}

	Object.keys(appears).map((item) => {
		appears[item] = spring({
			frame: frame - triggers[item],
			from: 0,
			to: 1,
			fps,
			config: { damping: 10.5, stiffness: 160, mass: 0.6 },
		})
	})

	const bounces = [140, 210]
	let bounceTriggers = []
	const mergedBounceTriggers = bounces.map((bounce) => [
		bounce,
		bounce + 10,
		bounce + 20,
		bounce + 30,
	])
	mergedBounceTriggers.forEach((arr) => {
		bounceTriggers = [...bounceTriggers, ...arr]
	})

	const bounce = interpolate(
		frame,
		bounceTriggers,
		[1, 0.8, 1, 1, 1, 0.9, 1, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	)

	const bellActivated = interpolate(
		frame,
		[280, 285, 290, 295, 300, 305, 310],
		[1, 0, 2, 1, 0, 2, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	)

	const ratioBarWidth = interpolate(frame, [60, 120], [0, 1], {
		easing: Easing.bezier(0.37, 0.37, 0.21, 0.97),
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	})

	const ratioBarFillWidth = interpolate(frame, [140, 200], [0, 1], {
		easing: Easing.bezier(0.37, 0.37, 0.21, 0.97),
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	})

	const mousePosBottom = interpolate(
		frame,
		[100, 130, 320, 350],
		[-15, 35, 35, 10],
		{
			easing: Easing.bezier(0.37, 0.37, 0.21, 0.97),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	)

	const mousePosLeft = interpolate(
		frame,
		[100, 130, 150, 200, 220, 270, 320, 350],
		[40, 34, 34, 60, 60, 75, 75, 85],
		{
			easing: Easing.bezier(0.37, 0.37, 0.21, 0.97),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	)

	const clicks = [130, 200, 270]
	let clickTriggers = []
	const mergedClickTriggers = clicks.map((click) => [
		click,
		click + 10,
		click + 20,
		click + 30,
	])
	mergedClickTriggers.forEach((arr) => {
		clickTriggers = [...clickTriggers, ...arr]
	})

	const click = interpolate(
		frame,
		clickTriggers,
		[1, 0.8, 1.2, 1, 1, 0.8, 1.2, 1, 1, 0.8, 1.2, 1],
		{
			easing: Easing.bezier(0.37, 0.37, 0.21, 0.97),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	)
	return (
		<div
			style={{
				flex: 1,
				backgroundColor: '#11fe00',
				display: 'grid',
				placeItems: 'center',
			}}
		>
			{/* Box */}
			<div
				style={{
					display: 'flex',
					background: 'white',
					width: '70%',
					height: '30%',
					position: 'relative',
					borderRadius: '4rem',
					transform: `scale(${appears.box})`,
				}}
			>
				{profilePicture && (
					<Img
						src={profilePicture}
						alt="profile picture"
						style={{
							height: '70%',
							position: 'absolute',
							top: '50%',
							transform: `translateY(-50%) scale(${appears.profilePicture})`,
							left: '4rem',
							borderRadius: '50%',
						}}
					/>
				)}

				{/* Thumbs */}
				<Sequence from={40} durationInFrames={Infinity}>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							padding: '0 2rem',
							left: '21rem',
							display: 'flex',
							width: '25%',
							alignItems: 'center',
							justifyContent: 'space-between',
							transform: 'translateY(-50%)',
						}}
					>
						{/* Ratio bar */}
						<div
							style={{
								position: 'absolute',
								height: '12px',
								bottom: '-3em',
								borderRadius: '1rem',
								background: 'black',
								width: `${ratioBarWidth * 100}%`,
								left: 0,
							}}
						>
							<div
								style={{
									position: 'absolute',
									height: '12px',
									bottom: '-3em',
									borderRadius: '1rem',
									background: '#0a84fe',
									width: `${ratioBarFillWidth * 100}%`,
									left: 0,
									top: 0,
								}}
							/>
						</div>
						<ThumbUpIcon
							style={{
								fontSize: 110,
								transform: `scale(${
									frame >= 140 && frame <= 160 ? bounce : appears.thumbUp
								}) rotate(${appears.thumbUp * 30 - 30}deg)`,
								color: thumbUp ? '#0a84fe' : 'black',
							}}
						/>
						<ThumbDownIcon
							style={{
								fontSize: 110,
								transform: `scale(${appears.thumbDown}) rotate(${
									30 - appears.thumbDown * 30
								}deg)`,
							}}
						/>
					</div>
				</Sequence>

				{/* Subscribe button */}
				<Sequence from={20} durationInFrames={Infinity}>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							right: '15rem',
							width: '28%',
							height: '35%',
							background: subscribed ? '#615e61' : '#fe4e4f',
							borderRadius: '1rem',
							color: 'white',
							display: 'grid',
							placeItems: 'center',
							fontSize: '3.5rem',
							fontWeight: 500,
							fontFamily: 'Roboto, sans-serif',
							transform: `translateY(-50%) scale(${
								frame >= 210 && frame <= 230 ? bounce : appears.subscribe
							})`,
						}}
					>
						{subscribed ? 'Subscribed' : 'Subscribe'}
					</div>
				</Sequence>

				{/* Bell */}
				<Sequence from={30} durationInFrames={Infinity}>
					{notifications ? (
						<NotificationsActiveIcon
							style={{
								fontSize: 120,
								position: 'absolute',
								right: '4rem',
								top: '50%',
								transform: `translateY(-50%) scale(${appears.bell}) rotate(${
									frame >= 280 && frame <= 310
										? bellActivated * 30 - 30
										: 30 - appears.bell * 30
								}deg)`,
							}}
						/>
					) : (
						<NotificationsNoneIcon
							style={{
								fontSize: 120,
								position: 'absolute',
								right: '4rem',
								top: '50%',
								transform: `translateY(-50%) scale(${appears.bell}) rotate(${
									frame >= 280
										? bellActivated * 30 - 30
										: 30 - appears.bell * 30
								}deg)`,
							}}
						/>
					)}
				</Sequence>
				<Sequence from={130} durationInFrames={20}>
					<Audio src={clickSound} startFrom={60} endAt={80} />
				</Sequence>
				<Sequence from={200} durationInFrames={20}>
					<Audio src={clickSound} startFrom={60} endAt={80} />
				</Sequence>
				<Sequence from={270} durationInFrames={40}>
					<Audio src={bellSound} startFrom={10} endAt={50} />
				</Sequence>
			</div>
			<Img
				src={Cursor}
				alt="cursor"
				style={{
					width: 200,
					position: 'absolute',
					left: `${mousePosLeft}%`,
					bottom: `${mousePosBottom}%`,
					transform: `scale(calc(${click} - 0.3))`,
				}}
			/>
		</div>
	)
}

export default Popup
