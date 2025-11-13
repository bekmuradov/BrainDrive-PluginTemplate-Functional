# React Hooks Guide for BrainDrive Plugins

## Introduction

React Hooks are functions that let you use state and other React features in functional components. This guide covers hooks best practices specifically for BrainDrive plugin development.

## Table of Contents

1. [Core Hooks](#core-hooks)
2. [Custom Hooks](#custom-hooks)
3. [Rules of Hooks](#rules-of-hooks)
4. [Common Patterns](#common-patterns)
5. [Performance Optimization](#performance-optimization)
6. [Common Pitfalls](#common-pitfalls)
7. [Testing Hooks](#testing-hooks)

## Core Hooks

### useState

Manages component state.

#### Basic Usage

```tsx
import { useState } from 'react';

const Counter: React.FC = () => {
  // Declare state variable
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev + 1)}>Increment (functional)</button>
    </div>
  );
};
```

#### With Objects

```tsx
interface UserData {
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserData>({
    name: '',
    email: ''
  });

  // Update single field
  const updateName = (name: string) => {
    setUser(prev => ({ ...prev, name }));
  };

  // Update multiple fields
  const updateUser = (updates: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return <div>...</div>;
};
```

#### Best Practices

```tsx
// ✅ Use functional updates when new state depends on previous state
setCount(prev => prev + 1);

// ❌ Don't rely on current state value
setCount(count + 1);

// ✅ Initialize with function for expensive computations
const [data, setData] = useState(() => {
  return expensiveComputation();
});

// ❌ Don't call expensive functions directly
const [data, setData] = useState(expensiveComputation());
```

---

### useEffect

Performs side effects in functional components.

#### Basic Usage

```tsx
import { useEffect } from 'react';

const MyComponent: React.FC = () => {
  // Runs after every render
  useEffect(() => {
    console.log('Component rendered');
  });

  // Runs once after first render (componentDidMount)
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Empty dependency array

  // Runs when dependencies change
  useEffect(() => {
    console.log('Count changed');
  }, [count]); // Runs when count changes

  return <div>...</div>;
};
```

#### With Cleanup

```tsx
const SubscriptionComponent: React.FC<{ services: Services }> = ({ services }) => {
  useEffect(() => {
    if (!services.theme) return;

    // Setup
    const listener = (theme: string) => {
      console.log('Theme changed:', theme);
    };

    services.theme.addThemeChangeListener(listener);

    // Cleanup (componentWillUnmount)
    return () => {
      services.theme?.removeThemeChangeListener(listener);
    };
  }, [services.theme]);

  return <div>...</div>;
};
```

#### Async Effects

```tsx
const DataFetcher: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ✅ Define async function inside useEffect
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    };

    fetchData();
  }, []);

  // ❌ Don't make useEffect itself async
  // useEffect(async () => { ... }, []);

  return <div>...</div>;
};
```

#### Dependency Arrays

```tsx
const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ Missing dependencies - will use stale values
  useEffect(() => {
    console.log(count, name);
  }, []); // Should include [count, name]

  // ✅ All dependencies included
  useEffect(() => {
    console.log(count, name);
  }, [count, name]);

  // ✅ Functions from props/state should be in dependencies
  useEffect(() => {
    props.onUpdate(count);
  }, [props.onUpdate, count]);

  return <div>...</div>;
};
```

---

### useRef

Stores mutable values that persist across renders without causing re-renders.

#### Basic Usage

```tsx
import { useRef } from 'react';

const TextInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
};
```

#### Storing Mutable Values

```tsx
const Counter: React.FC = () => {
  const countRef = useRef(0);
  const [, forceUpdate] = useState({});

  const increment = () => {
    countRef.current++;
    // Does NOT trigger re-render
    console.log(countRef.current);
  };

  const incrementAndRender = () => {
    countRef.current++;
    forceUpdate({}); // Force re-render
  };

  return (
    <div>
      <p>Count: {countRef.current}</p>
      <button onClick={increment}>Increment (no render)</button>
      <button onClick={incrementAndRender}>Increment & Render</button>
    </div>
  );
};
```

#### Storing Previous Values

```tsx
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Usage
const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
    </div>
  );
};
```

---

### useCallback

Memoizes functions to prevent unnecessary re-creations.

#### Basic Usage

```tsx
import { useCallback } from 'react';

const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  // ❌ Function is recreated on every render
  const handleClick = () => {
    setCount(count + 1);
  };

  // ✅ Function is memoized
  const handleClickMemoized = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty deps - function never changes

  // ✅ Function recreated only when dependencies change
  const handleClickWithDeps = useCallback(() => {
    console.log('Count is:', count);
  }, [count]); // Recreated when count changes

  return <button onClick={handleClickMemoized}>Increment</button>;
};
```

#### When to Use

```tsx
// ✅ Use when passing callbacks to optimized child components
const Parent: React.FC = () => {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <MemoizedChild onClick={handleClick} />;
};

const MemoizedChild = React.memo<{ onClick: () => void }>(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});

// ✅ Use when callback is a dependency of useEffect
const MyComponent: React.FC = () => {
  const fetchData = useCallback(async () => {
    const response = await fetch('/api/data');
    return response.json();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Won't cause infinite loop

  return <div>...</div>;
};
```

---

### useMemo

Memoizes expensive computations.

#### Basic Usage

```tsx
import { useMemo } from 'react';

const ExpensiveComponent: React.FC<{ items: Item[] }> = ({ items }) => {
  // ❌ Computed on every render
  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));

  // ✅ Only recomputed when items change
  const sortedItemsMemoized = useMemo(() => {
    console.log('Sorting items...');
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return <div>{/* Render sorted items */}</div>;
};
```

#### When to Use

```tsx
// ✅ Use for expensive calculations
const filteredAndSorted = useMemo(() => {
  return items
    .filter(item => item.active)
    .sort((a, b) => b.priority - a.priority);
}, [items]);

// ✅ Use to prevent object recreation (for dependency arrays)
const config = useMemo(() => ({
  timeout: 1000,
  retries: 3
}), []); // Object reference stays the same

// ❌ Don't use for simple operations
const doubled = useMemo(() => count * 2, [count]); // Overkill
const doubled = count * 2; // Better
```

---

## Custom Hooks

### Creating Custom Hooks

Custom hooks let you extract component logic into reusable functions.

#### Simple Custom Hook

```tsx
// useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage
const MyComponent: React.FC = () => {
  const [name, setName] = useLocalStorage('username', '');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};
```

#### Complex Custom Hook

```tsx
// useAPI.ts
import { useState, useCallback } from 'react';

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string) => Promise<void>;
}

function useAPI<T = any>(): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Request failed');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

// Usage
const MyComponent: React.FC = () => {
  const { data, loading, error, execute } = useAPI<UserData>();

  useEffect(() => {
    execute('/api/user');
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
};
```

### BrainDrive Custom Hooks

See [Service Bridges documentation](./SERVICE_BRIDGES.md) for BrainDrive-specific hooks:

- `useTheme` - Theme service integration
- `usePageContext` - Page context service
- `useSettings` - Settings service
- `useAPI` - API service
- `useErrorHandler` - Error handling

---

## Rules of Hooks

### Rule #1: Only Call Hooks at the Top Level

```tsx
// ❌ Don't call hooks inside conditionals
const MyComponent: React.FC = () => {
  if (condition) {
    const [state, setState] = useState(0); // ❌ Error!
  }

  return <div>...</div>;
};

// ✅ Call hooks at top level
const MyComponent: React.FC = () => {
  const [state, setState] = useState(0);

  if (condition) {
    // Use the hook value conditionally
  }

  return <div>...</div>;
};
```

### Rule #2: Only Call Hooks from React Functions

```tsx
// ❌ Don't call hooks from regular functions
function regularFunction() {
  const [state, setState] = useState(0); // ❌ Error!
}

// ✅ Call hooks from functional components
const MyComponent: React.FC = () => {
  const [state, setState] = useState(0); // ✅ Correct
  return <div>...</div>;
};

// ✅ Call hooks from custom hooks
function useCustomHook() {
  const [state, setState] = useState(0); // ✅ Correct
  return state;
}
```

---

## Common Patterns

### Pattern 1: Data Fetching

```tsx
const DataFetcher: React.FC<{ userId: string }> = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const json = await response.json();

        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true; // Prevent state updates if component unmounts
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
};
```

### Pattern 2: Debounced Input

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

### Pattern 3: Window Event Listeners

```tsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}

// Usage
const ResponsiveComponent: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <div>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
};
```

---

## Performance Optimization

### Avoid Unnecessary Re-renders

```tsx
// ❌ Child re-renders on every parent render
const Parent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child data={{ value: 'static' }} />
    </div>
  );
};

// ✅ Child only re-renders when props change
const Parent: React.FC = () => {
  const [count, setCount] = useState(0);
  const data = useMemo(() => ({ value: 'static' }), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoizedChild data={data} />
    </div>
  );
};

const MemoizedChild = React.memo<{ data: { value: string } }>(({ data }) => {
  console.log('Child rendered');
  return <div>{data.value}</div>;
});
```

### Use React.memo Wisely

```tsx
// ✅ Use for expensive components
const ExpensiveComponent = React.memo<{ data: ComplexData }>(({ data }) => {
  // Expensive rendering logic
  return <div>...</div>;
});

// ❌ Don't use for simple components
const SimpleComponent = React.memo<{ text: string }>(({ text }) => {
  return <div>{text}</div>; // Too simple to benefit from memoization
});
```

---

## Common Pitfalls

### Pitfall 1: Stale Closures

```tsx
// ❌ Stale closure - always logs 0
const BadExample: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count); // Always 0!
      setCount(count + 1); // Doesn't work correctly
    }, 1000);

    return () => clearInterval(interval);
  }, []); // count not in dependencies!

  return <div>{count}</div>;
};

// ✅ Use functional updates
const GoodExample: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1); // Uses latest value
    }, 1000);

    return () => clearInterval(interval);
  }, []); // No dependencies needed

  return <div>{count}</div>;
};
```

### Pitfall 2: Infinite Loops

```tsx
// ❌ Infinite loop - useEffect updates state, which triggers useEffect again
const BadExample: React.FC = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData({ updated: true }); // Creates new object
  }, [data]); // Depends on data - infinite loop!

  return <div>...</div>;
};

// ✅ Use correct dependencies
const GoodExample: React.FC = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    // Runs once on mount
    setData({ updated: true });
  }, []); // Empty dependencies

  return <div>...</div>;
};
```

### Pitfall 3: Not Cleaning Up

```tsx
// ❌ Memory leak - listener not removed
const BadExample: React.FC<{ services: Services }> = ({ services }) => {
  useEffect(() => {
    const listener = (theme: string) => console.log(theme);
    services.theme?.addThemeChangeListener(listener);
    // Missing cleanup!
  }, [services.theme]);

  return <div>...</div>;
};

// ✅ Always cleanup subscriptions
const GoodExample: React.FC<{ services: Services }> = ({ services }) => {
  useEffect(() => {
    const listener = (theme: string) => console.log(theme);
    services.theme?.addThemeChangeListener(listener);

    return () => {
      services.theme?.removeThemeChangeListener(listener);
    };
  }, [services.theme]);

  return <div>...</div>;
};
```

---

## Testing Hooks

### Testing Custom Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});
```

### Testing Components with Hooks

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should update count on button click', () => {
    render(<MyComponent />);

    const button = screen.getByText('Increment');
    const count = screen.getByText(/Count:/);

    expect(count).toHaveTextContent('Count: 0');

    fireEvent.click(button);

    expect(count).toHaveTextContent('Count: 1');
  });
});
```

---

## Resources

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Service Bridges Guide](./SERVICE_BRIDGES.md)
- [Theming Guide](./THEMING.md)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)

## Next Steps

1. Review the [Custom Hooks](../src/hooks/) in this template
2. Read [SERVICE_BRIDGES.md](./SERVICE_BRIDGES.md) for BrainDrive-specific hooks
3. Check [examples](../src/examples/) for complete implementations
4. Start building your plugin with functional components!
