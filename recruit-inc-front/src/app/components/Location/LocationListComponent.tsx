import React from 'react';
import { LocationListProps } from '../../props/LocationListProps';
import { LocationCard } from './LocationCard';

export class LocationListComponent extends React.Component<
  LocationListProps,
  {}
> {
  constructor(props: LocationListProps) {
    super(props);
  }

  createUniqueId(locationName: string): string {
    const randomNumber: number = Math.floor(Math.random() * 100 + 1);
    return locationName.replace(/ /g, '') + randomNumber;
  }

  render() {
    return (
      <div className="row">
        {this.props.Locations.LocationList.map(l => (
          <LocationCard key={l.name} locationWatchData={l} />
        ))}
      </div>
    );
  }
}
