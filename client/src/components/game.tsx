import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"
import Map from "./map"
import Cards from "./cards"
import Controls from "./controls"

interface Props {
    game: ClueLess.Game,
    player: ClueLess.Player
}
interface State {}

export default class Game extends React.Component<Props, State>
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

        // Do we have a winner?
        if (this.props.game && this.props.game.winner) {
            const winningPlayer = this.props.game.players.find(p => p.id == this.props.game.winner) as ClueLess.Player
            return (
                <div className="game">
                    <h1>{ winningPlayer.character } won the game!</h1>
                    <h2>Case File</h2>
                    <p>
                        Suspect: { this.props.game.case_file.suspect }
                        <br />
                        Weapon: { this.props.game.case_file.weapon }
                        <br />
                        Location: { this.props.game.case_file.location }
                    </p>
                </div>
            )
        }

        return (
        	<div className="game">
        		<div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    justifyContent: "flex-start",
                }}>
                    <Map game={this.props.game} />
                    <div>
                        <h2>Playing As: { this.props.player.character } <span style={{ display: "inline-block" }} className={ "player " + this.props.player.color } /></h2>
                        <Cards cards={this.props.player.cards} />
                        <Controls game={this.props.game} player={this.props.player} />
                    </div>
                </div>
                <hr />
        	</div>
        )
    }
}