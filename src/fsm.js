class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config)
            throw new Error();

        this.states = config.states;
        this.stack = [];
        this.stack.push(config.initial);
        this.initial = config.initial;
        this.deleted = [];
        this.is_initial = true;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.stack[this.stack.length - 1];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.states[state] == undefined)
            throw new Error();
        this.stack.push(state);
        this.is_initial = false;
        this.deleted = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var new_state;
        new_state = this.states[this.stack[this.stack.length - 1]].transitions[event];
        if (new_state == undefined)
            throw new Error();
        this.stack.push(new_state);
        this.is_initial = false;
        this.deleted = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.stack = []
        this.stack.push(this.initial);
        this.is_initial = true;
        this.deleted = [];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event == undefined) {
            var keys = [];
            for (var key in this.states)
                keys.push(key);
            return keys;
        } else {
            var values = [];
            for (var key in this.states) {
                if (this.states[key].transitions[event] == undefined)
                    continue;
                values.push(key)
            }
            return values;
        }


    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.is_initial || this.stack.length <= 1)
            return false;
        else {
            this.deleted.push(this.stack[this.stack.length - 1]);
            this.stack.pop();
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.deleted == false)
            return false;
        else {
            this.stack.push(this.deleted[this.deleted.length - 1])
            this.deleted.pop();
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        var tmp_state = this.stack[this.stack.length - 1];
        this.stack = [];
        this.deleted = [];
        this.stack.push(tmp_state);
        this.is_initial = true;
    }
}

module.exports = FSM;