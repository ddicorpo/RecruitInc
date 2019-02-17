/**
 * Based class for our adapter, we can shared logging method
 */
export abstract class BaseAdapter {
  abstract adapt(jsonObj: JSON): any;
}
