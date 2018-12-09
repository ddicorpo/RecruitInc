import Autosuggest, {ChangeEvent, SuggestionsFetchRequestedParams} from 'react-autosuggest';
import * as React from 'react';
import {FormEvent} from "react";


class AutocompleteSearch extends React.Component<{ suggestions: string[] }, any> {
    constructor(props: any) {
        super(props);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: "",
            suggestions: []
        };
    }

    private getSuggestions(value: string): string[] {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.suggestions.filter(suggestion =>
            suggestion.toLowerCase().slice(0, inputLength) === inputValue
        );
    }

    private onChange(event: FormEvent<any>, params: ChangeEvent): void {
        const newValue: string = params.newValue;
        const suggestions: string[] = this.getSuggestions(newValue);
        if (suggestions === undefined || suggestions.length == 0) {
            // We don't allow the user to type something that isn't part of our suggestions.
            return;
        } else {
            this.setState({
                value: newValue
            });
        }

    }

    private onSuggestionsFetchRequested(params: SuggestionsFetchRequestedParams): void {
        this.setState({
            suggestions: this.getSuggestions(params.value)
        });
    }

    private onSuggestionsClearRequested(): void {
        this.setState({
            suggestions: []
        });
    }

    private getSuggestionValue(suggestion: string): string {
        return suggestion;
    }

    private renderSuggestion(suggestion: string): JSX.Element {
        return (
            <div>
                {suggestion}
            </div>
        );
    }


    render() {

        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type a programming language',
            value,
            onChange: this.onChange
        };


        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}

export default AutocompleteSearch;