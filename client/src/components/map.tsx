import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"

interface Props {
    game: ClueLess.Game
}
interface State {}

export default class Map extends React.Component<Props, State>
{
    getPlayersInLocation(name: string): ClueLess.Player[] {
        const location = this.props.game.locations.find(l => l.name === name)
        if (!location) {
            return []
        }
        return this.props.game.players.filter(p => location.players.indexOf(p.id) > -1)
    }

    renderPlayersInLocation(name: string): JSX.Element[] {
        return this.getPlayersInLocation(name).map((player) => {
            return (
                <div key={player.id} className={"player " + player.color } />
            )
        })
    }

    render() {

        return (
    		<div className="map">
    			<div key="room-top-left" className="room top-left">
    				Study
    				{ this.renderPlayersInLocation("Study") }
    				<div className="passage bottom-right" />
    			</div>
    			<div key="room-top-mid" className="room top-mid">
    				Hall
    				{ this.renderPlayersInLocation("Hall") }
    			</div>
    			<div key="room-top-right" className="room top-right">
    				Lounge
                    { this.renderPlayersInLocation("Lounge") }
    				<div className="passage bottom-right" />
    			</div>

    			<div key="room-mid-left" className="room mid-left">
    				Library
                    { this.renderPlayersInLocation("Library") }
    			</div>
    			<div key="room-mid-mid" className="room mid-mid">
    				Billiard Room
                    { this.renderPlayersInLocation("Billiard Room") }
    			</div>
    			<div key="room-mid-right" className="room mid-right">
    				Dining Room
                    { this.renderPlayersInLocation("Dining Room") }
    			</div>

    			<div key="room-bottom-left" className="room bottom-left">
    				Conservatory
                    { this.renderPlayersInLocation("Conservatory") }
    				<div className="passage top-right" />
    			</div>
    			<div key="room-bottom-mid" className="room bottom-mid">
    				Ballroom
                    { this.renderPlayersInLocation("Ballroom") }
    			</div>
    			<div key="room-bottom-right" className="room bottom-right">
    				Kitchen
    				{ this.renderPlayersInLocation("Kitchen") }
    				<div className="passage top-left" />
    			</div>

    			<div key="hallway-top-left-vertical" className="hallway top-left vertical">
    				{ this.renderPlayersInLocation("HallwayStudyToLibrary") }
    			</div>
    			<div key="hallway-top-left-horizontal" className="hallway top-left horizontal">
                    { this.renderPlayersInLocation("HallwayStudyToHall") }
                </div>

    			<div key="hallway-top-mid-vertical" className="hallway top-mid vertical">
                    { this.renderPlayersInLocation("HallwayHallToBilliardRoom") }
                </div>
    			<div key="hallway-top-mid-horizontal" className="hallway top-mid horizontal">
                    { this.renderPlayersInLocation("HallwayHallToLounge") }
                </div>
    			<div key="hallway-top-right-vertical" className="hallway top-right vertical">
                    { this.renderPlayersInLocation("HallwayLoungeToDiningRoom") }
                </div>

    			<div key="hallway-mid-left-vertical" className="hallway mid-left vertical">
                    { this.renderPlayersInLocation("HallwayLibraryToConservatory") }
                </div>
    			<div key="hallway-mid-left-horizontal" className="hallway mid-left horizontal">
                    { this.renderPlayersInLocation("HallwayLibraryToBilliardRoom") }
                </div>
    			<div key="hallway-mid-mid-vertical" className="hallway mid-mid vertical">
                    { this.renderPlayersInLocation("HallwayBilliardRoomToBallroom") }
                </div>
    			<div key="hallway-mid-mid-horizontal" className="hallway mid-mid horizontal">
                    { this.renderPlayersInLocation("HallwayBilliardRoomToDiningRoom") }
                </div>
    			<div key="hallway-mid-right-vertical" className="hallway mid-right vertical">
                    { this.renderPlayersInLocation("HallwayDiningRoomToKitchen") }
                </div>

    			<div key="hallway-bottom-left-horizontal" className="hallway bottom-left horizontal">
                    { this.renderPlayersInLocation("HallwayConservatoryToBallroom") }
                </div>
    			<div key="hallway-bottom-mid-horizontal" className="hallway bottom-mid horizontal">
                    { this.renderPlayersInLocation("HallwayBallroomToKitchen") }
                </div>
    		</div>
        )
    }
}