import { useEffect, useState } from 'react'
import {
	useCurrentFrame,
	useVideoConfig,
	spring,
	Sequence,
	interpolate,
	Easing,
	Img,
} from 'remotion'
import styled from 'styled-components'
import './fonts/roboto.css'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Cursor from './images/cursor.svg'

const Container = () => {
	const frame = useCurrentFrame()
	const { fps } = useVideoConfig()

	const [notifications, setNotifications] = useState(false)
	const [subscribed, setSubscribed] = useState(false)
	const [thumbUp, setThumbUp] = useState(false)

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

	const triggers = {
		box: 0,
		subscribe: 20,
		bell: 30,
		thumbUp: 40,
		thumbDown: 50,
	}

	let boxAppear, subscribeAppear, bellAppear, thumbUpAppear, thumbDownAppear

	const appears = {
		box: boxAppear,
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
		[30, 25, 25, 55, 55, 70, 70, 80],
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
	width: 60%;
	height: 30%;
	position: relative;
	border-radius: 4rem;
`

const SubscribeButton = styled.div`
	position: absolute;
	top: 50%;
	right: 15rem;
	width: 35%;
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
	left: 4rem;
	display: flex;
	width: 30%;
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

export default Container
