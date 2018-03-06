var proto = require("../../data_pb");
import { ResourceList } from "../resource";
import { GameAction } from "./gameAction";

export class TradeBank extends GameAction {
    constructor() {
        super();
    }
    perform(game) {
        const requestedResourceList = new ResourceList(this.requestedResources);
        const offeredResourceList = new ResourceList(this.offeredResources);
        game.bank.resources.moveFrom(this.player.resources, offeredResourceList);
        this.player.resources.moveFrom(game.bank.resources, requestedResourceList);
    }
    static fromData(data) {
        const tradeBank = new TradeBank();
        tradeBank.offeredResources = data.getOfferedResourcesList();
        tradeBank.requestedResources = data.getRequestedResourcesList();
        return tradeBank;
    }
    static createData(player, offeredResources, requestedResources) {
        const action = new proto.GameAction();
        action.setPlayerId(player.id);
        var tradeBank = new proto.TradeBank();
        tradeBank.setOfferedResourcesList(offeredResources);
        tradeBank.setRequestedResourcesList(requestedResources);
        action.setTradeBank(tradeBank);
        return action;
    }
}