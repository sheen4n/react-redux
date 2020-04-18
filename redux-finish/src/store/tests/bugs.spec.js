import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addBug, resolveBug, loadBugs, getUnresolvedBugs } from '../bugs';
// import { apiCallBegan } from '../api';
import configureStore from '../configureStore';

// Solitary Test
// describe('bugsSlice', () => {
//   describe('action creators', () => {
//     it('addBug', () => {
//       const bug = { description: 'ABC' };
//       const result = addBug(bug);
//       const expected = {
//         type: apiCallBegan.type,
//         payload: {
//           url: '/bugs',
//           method: 'post',
//           data: bug,
//           onSuccess: bugAdded.type,
//         },
//       };

//       expect(result).toEqual(expected);
//     });
//   });
// });

// Social Test - Integration Test
describe('bugsSlice', () => {
  it('should handle the addBug action - integration', async () => {
    const store = configureStore();
    const bug = { description: 'ABC' };
    await store.dispatch(addBug(bug));
    // console.log(store.getState());
    expect(store.getState().entities.bugs.list).toHaveLength(1);
  });
});

// Social Test - Unit Test
describe('bugsSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it('should add the bug to the store if it is saved to the server - unit', async () => {
    // Arrange
    const bug = { description: 'ABC' };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost('/bugs').reply(200, savedBug);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it('should not add the bug to the store if it is not saved to the server - unit', async () => {
    // Arrange
    const bug = { description: 'ABC' };
    fakeAxios.onPost('/bugs').reply(500);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toHaveLength(0);
  });

  it('should resolve the bug in the store if it is successfully resolved in the server- unit', async () => {
    // Arrange
    const bug = { description: 'ABC' };
    const savedBug = { ...bug, id: 1, resolved: false };
    const resolvedBug = { ...bug, id: 1, resolved: true };
    fakeAxios.onPost('/bugs').reply(200, savedBug);
    fakeAxios.onPatch('/bugs/' + savedBug.id, { resolved: true }).reply(200, resolvedBug);

    // Act
    await store.dispatch(addBug(bug));
    await store.dispatch(resolveBug(savedBug.id));

    // Assert
    expect(bugsSlice().list.find((item) => item.id === savedBug.id).resolved).toBe(true);
  });

  it('should not resolve the bug in the store if it is not successfully resolved in the server- unit', async () => {
    // Arrange
    const bug = { description: 'ABC' };
    const savedBug = { ...bug, id: 1, resolved: false };
    fakeAxios.onPost('/bugs').reply(200, savedBug);
    fakeAxios.onPatch('/bugs/' + savedBug.id, { resolved: true }).reply(500);

    // Act
    await store.dispatch(addBug(bug));
    await store.dispatch(resolveBug(savedBug.id));

    // Assert
    expect(bugsSlice().list.find((item) => item.id === savedBug.id).resolved).not.toBe(true);
  });

  describe('loading bugs', () => {
    describe('if the bugs exist in the cache', () => {
      if (
        ('they should be fetched from the server and put in the store',
        async () => {
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }, { id: 2 }, { id: 3 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().list).toHaveLength(3);
        })
      );

      it('shoud not be fetched from the server again', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });

    describe('if the bugs do not exist in the cache', () => {
      describe('loading indicator', () => {
        it('should be true while fetching the bugs', () => {
          fakeAxios.onGet('/bugs').reply(() => {
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(true);
        });

        it('should be false after successfully fetching the bugs', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);
          await store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(false);
        });

        it('should be false if server replies an error', async () => {
          fakeAxios.onGet('/bugs').reply(500);
          await store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  describe('selectors', () => {
    it('getUnresolvedBugs', () => {
      // Arrange
      const state = createState();
      state.entities.bugs.list = [{ id: 1, resolved: true }, { id: 2 }, { id: 3, resolved: true }];

      // Act
      const result = getUnresolvedBugs(state);

      // Assert
      expect(result).toHaveLength(1);
    });
  });
});
