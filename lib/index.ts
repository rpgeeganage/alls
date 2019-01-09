/**
 * Promise states
 *
 * @export
 * @enum {number}
 */
export enum PromiseState {
  fulfilled = 'fulfilled',
  rejected = 'rejected'
}

/**
 * Return value interface
 *
 * @export
 * @interface ReturnValue
 */
export interface ReturnValue {
  state: PromiseState;
  reason?: any;
  value?: any;
}

class Alls {
  /**
   * Creates an instance of Alls.
   * @param {Promise<any>[]} promises
   * @memberof Alls
   */
  constructor(public promises: Promise<any>[]) {}

  /**
   * Get instance of an Alls
   *
   * @static
   * @param {Promise<any>[]} promises
   * @returns {Alls}
   * @memberof Alls
   */
  static getInstance(promises: Promise<any>[]): Alls {
    return new Alls(promises);
  }

  /**
   * Process promise list
   *
   * @returns {Promise<ReturnValue[]>}
   * @memberof Alls
   */
  process(): Promise<ReturnValue[]> {
    const promisesList = this.promises.map((p) => {
      if (!this.isPromise(p)) {
        return {
          state: 'fulfilled',
          value: p
        };
      }

      return p
        .then(
          (e): ReturnValue => {
            return {
              state: PromiseState.fulfilled,
              value: e
            };
          }
        )
        .catch(
          (err): ReturnValue => {
            return {
              state: PromiseState.rejected,
              reason: err
            };
          }
        );
    });

    return Promise.all(promisesList as Promise<any>[]);
  }

  /**
   * Check given object is a promise
   *
   * @returns {boolean}
   * @memberof Alls
   */
  private isPromise(p: any) {
    if (!p) {
      return false;
    }

    if (p.toString() === '[object Promise]') {
      return true;
    }

    // For none native promises
    return p && typeof p['then'] === 'function';
  }
}

/**
 * alls processing function
 *
 * @export
 * @param {Promise<any>[]} promises
 * @returns {Promise<ReturnValue[]>}
 */
export function alls(promises: Promise<any>[]): Promise<ReturnValue[]> {
  return Alls.getInstance(promises).process();
}
