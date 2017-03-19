
Generate your actions and functions based on your Flow type:

Automagically transform your Flow type action:

```
export type SuperCooolAction = {
    type: 'super-cool/AWESOME',
    value: string
};
```

Into both this:

```
function superCooolAction(value: string): SuperCooolAction {
    return {
        type: 'super-cool/AWESOME',
        value
    };
}
```

And this:

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
