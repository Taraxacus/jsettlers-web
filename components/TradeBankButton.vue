<template>
    <popper trigger="hover" :options="{placement: 'top'}" class="root">
        <ul class="popper popup">
            <div class="popup-hero">
                <img class="popup-logo" src="doc/images/TradeBank48.png" />
                <span class="popup-title">Trade with the bank</span>
            </div>
            <span>Trade resources with the bank, using your ports to get a good deal</span>
            <ul>
                <li v-for="message in messages" :key="message">{{message}}</li>
            </ul>
        </ul>

        <div 
            id="trade-bank"
            @click="openTradeBankDialog()"
            class="build-button"
            slot="reference"
            v-bind:class="{ disabled: !canTradeBank }">
            <img id="button" src="doc/images/TradeBank48.png" />
        </div>
    </popper>
</template>

<script>
import * as m from "../src/matcher";
import Popper from 'vue-popperjs';
import { TradeBank } from '../src/actions/tradeBank';

export default {
    name: 'trade-bank-button',
    components: { Popper },
    props: {
        game: {
            type: Object
        }
    },
    data() {
        return {
            messages: [],
            canTradeBank: false,
        }
    },
    methods: {
        updateCanTradeBank() {
            const game = this.game;
            const player = this.game.player;
            this.messages = m.match([
                m.isOnTurn(game, player),
                m.isExpected(game, new TradeBank({player: player})),
                // TODO: check if player has resource to trade with
            ]);
            this.canTradeBank = this.messages.length === 0;
        },
        openTradeBankDialog() {
            this.$emit("tradeBank");
        }
    },
    mounted() {
        this.updateCanTradeBank();
        this.removeActionAddedHandler = this.game.actions.added((action) => {
            this.updateCanTradeBank();
        });
    },
    unmount() {
        this.removeActionAddedHandler();
    }
}
</script>

<style scoped>
.root {
    height:60px; /* todo: fix. 72 + half */
    align-self: end;
}
#buy-development-card {
    display: grid;
    grid-template-columns: 24px 24px;
    grid-template-rows: 24px 24px 24px;
}
#button {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 3;
    width: 48px;
    height: 48px;
}
#trade1 {
    grid-column-start: 1;
    grid-row-start: 2;
}
#trade2 {
    grid-column-start: 2;
    grid-row-start: 2;
}
#trade3 {
    grid-column-start: 1;
    grid-row-start: 1;
}
</style>