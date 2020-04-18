import React, { useEffect } from 'react';
import { loadBugs, getUnresolvedBugs, resolveBug } from '../store/bugs';
import { useDispatch, useSelector } from 'react-redux';

const BugsList = () => {
  const dispatch = useDispatch();
  // useSelector(state => state.entities.bugs.list)
  const bugs = useSelector(getUnresolvedBugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, [dispatch]);

  const handleResolve = (bugId) => () => {
    dispatch(resolveBug(bugId));
  };

  return (
    <div>
      <ul>
        {bugs.map((bug) => (
          <li key={bug.id}>
            {bug.description} <button onClick={handleResolve(bug.id)}>Resolve Bug</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BugsList;
