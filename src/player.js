import {Observable} from "./generic/observable.js";
import {Util} from "./util.js";
import {Stock} from "./stock.js";
import {Resource, Timber, Wheat, Ore, Sheep, Brick, Gold, ResourceList} from "./resource.js";
import {DevelopmentCard, YearOfPlenty, Monopoly, Soldier, VictoryPoint, RoadBuilding} from "./developmentCard.js";
import {Any4To1Port, Any3To1Port, PortList, Wheat2To1Port, Sheep2To1Port} from "./port.js";
import { ObservableMap } from "./generic/observableMap.js";
import { jsettlers as pb } from "../src/generated/data";

export class Player extends Observable {
    constructor(config) {
        super();

        config = config || {};

        this.id = config.id;
        this.color = config.color || 0x000000;
        this.user = config.user || new User();
        this.maxHandResources = 7;
        this.developmentCards = []; // TODO: ObservableArray
        this.playedDevelopmentCards = [];
        this.roadBuildingTokens = 0;
        this.victoryPoints = [];
        this.soldiers = [];
        this.routeLength = 0;
        this.stock = new Stock();
        this.ports = new PortList([new Any4To1Port()]);
        this.towns = new Map(); // <Node, Town>
        this.cities = new Map(); // <Node, City>
        this.roads = new Map(); // <Edge, Road>
        this.victoryPoints = []; // <Edge, Road>
        this.producers = new Map(); // <Node, Piece> (Piece = Town | City)
        this.nodePieces = new Map(); // <Node, Piece> (Piece = Town | City)
        this.edgePieces = new ObservableMap(); // <Edge, Piece> (Piece = Road)
        this.resources = new ResourceList();

        this.makeObservable(["user"]);
    }
    get victoryPointsCount() {
        let total = 0;
        for (let vp of this.victoryPoints) {
            total += vp.victoryPoints;
        }
        return total;
    }
    /** true if player can pay for given resources taking trades into account */
    canPayWith(resourceList) {
        const cost = resourceList;
        if (this.resources.hasAtLeast(cost)) {
            return true;
        }
        const amountGoldNeeded = resources.amountGoldNeeded(cost);
        const resourcesWithoutCost = new ResourceList(cost);
        resourcesWithoutCost.remove(cost);
        const amountGold = this.ports.amountGold(resourcesWithoutCost);
        return amountGold >= amountGoldNeeded;
    }
    static get colors() {
        if (Player._colors === undefined) {
            Player._colors = [Color.red, Color.green, Color.blue, Color.white, Color.brown, Color.orange];
        }
        return Player._colors;
    }
}
export class Color {
    constructor(integer, name) {
        this.integer = integer;
        this.name = name;
    }
    static get red() {
        if (Color._red === undefined) {
            Color._red = new Color(0xff0000, "Red");
        }
        return Color._red;
    }
    static get green() {
        if (Color._green === undefined) {
            Color._green = new Color(0x00ff00, "Green");
        }
        return Color._green;
    }
    static get blue() {
        if (Color._blue === undefined) {
            Color._blue = new Color(0x0000ff, "Blue");
        }
        return Color._blue;
    }
    static get white() {
        if (Color._white === undefined) {
            Color._white = new Color(0xbbbbbb, "White");
        }
        return Color._white;
    }
    static get brown() {
        if (Color._brown === undefined) {
            Color._brown = new Color(0xff0000, "Brown");
        }
        return Color._brown;
    }
    static get orange() {
        if (Color._orange === undefined) {
            Color._orange = new Color(0xff0000, "Orange");
        }
        return Color._orange;
    }
    /** returns color in #000000 format */
    get css() {
        if (this._cssString === undefined) {
            this._cssString = '#' + ('00000' + (this.integer | 0).toString(16)).substr(-6);
        }
        return this._cssString;
    }
    /** returns color in rgba(r, g, b, alpha) format */
    toCssRgba(alpha) {
        const r = (this.integer & 0xff0000) >> 16;
        const g = (this.integer & 0x00ff00) >> 8;
        const b = (this.integer & 0x0000ff);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
export class User {
    constructor(config) {
        config = config || {};

        this.name = config.name || "";
        this.color = config.color || null;
        this.id = config.id || 0;
    }
}