import React from 'react';
import { LocationListProps } from '../../props/LocationListProps';

export class LocationList extends React.Component<LocationListProps, {}> {
  constructor(props: LocationListProps) {
    super(props);
  }

  render() {
    return <p> Location List </p>;
  }
}
