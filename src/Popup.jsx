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
import styled from 'styled-components'
import './fonts/roboto.css'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Cursor from './images/cursor.svg'
import API_KEY from '../API_KEY'
import clickSound from './audio/click-sound.mp3'
import bellSound from './audio/bell-sound.mp3'

const Popup = ({ channelId }) => {
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
			`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`,
			{
				method: 'GET',
			}
		)
			.then((res) => res.json())
			.then((data) =>
				setProfilePicture(data.items[0].snippet.thumbnails.high.url)
			)
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
			<Box scale={appears.box}>
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
				<Sequence from={40} durationInFrames={Infinity}>
					<Thumbs
						ratioBarWidth={ratioBarWidth * 100}
						ratioBarFillWidth={ratioBarFillWidth * 100}
					>
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
					</Thumbs>
				</Sequence>

				<Sequence from={20} durationInFrames={Infinity}>
					<SubscribeButton
						className={subscribed ? 'sub' : ''}
						scale={frame >= 210 && frame <= 230 ? bounce : appears.subscribe}
					>
						{subscribed ? 'Subscribed' : 'Subscribe'}
					</SubscribeButton>
				</Sequence>

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
			</Box>
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

const Box = styled.div`
	display: flex;
	background: white;
	width: 70%;
	height: 30%;
	position: relative;
	border-radius: 4rem;
	transform: ${(props) => `scale(${props.scale})`};
`

const SubscribeButton = styled.div`
	position: absolute;
	top: 50%;
	right: 15rem;
	width: 28%;
	height: 35%;
	background: #fe4e4f;
	border-radius: 1rem;
	color: white;
	display: grid;
	place-items: center;
	font-size: 3.5rem;
	font-weight: 500;
	font-family: 'Roboto', 'sans-serif';
	transform: translateY(-50%) ${(props) => `scale(${props.scale})`};

	&.sub {
		background: #615e61;
	}
`

const Thumbs = styled.div`
	position: absolute;
	top: 50%;
	padding: 0 2rem;
	left: 21rem;
	display: flex;
	width: 25%;
	align-items: center;
	justify-content: space-between;
	transform: translateY(-50%);

	&::before,
	&::after {
		content: '';
		position: absolute;
		height: 12px;
		bottom: -3em;
		border-radius: 1rem;
	}

	&::before {
		background: black;
		width: ${(props) => `${props.ratioBarWidth}%`};
		left: 0;
	}

	&::after {
		background: #0a84fe;
		width: ${(props) => `${props.ratioBarFillWidth}%`};
		left: 0;
	}
`

export default Popup
