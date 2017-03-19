
Generate your actions and functions based on your Flow type:

Transform your Flow type action:

```
export type SuperCooolAction = {
    type: 'super-cool/AWESOME',
    value: 'Super value'
};
```

Into this:

```
function superCooolAction(value: 'Super value'): SuperCooolAction {
    return {
        type: 'super-cool/AWESOME',
        value
    };
}
```

Add this:

```
export default (state: State = initialState, action: Action): State ) {
		/* ... other actions generated here .. */
        case 'super-cool/AWESOME':
            return superCooolAction(state, action);
        default:
            return state;
    }
}
```

Mostly a proof of concept for now.

Cool goals:

* general project integration
* other generator for scaffolding the action/reducers/selectors/etc to support the above