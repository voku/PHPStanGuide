import React from 'react';
import { GuideSection } from './types';

// Helper components for consistent styling within the content
const P = ({ children }: { children?: React.ReactNode }) => (
  <p className="text-[1.05rem] leading-[1.8] text-slate-700 dark:text-slate-300 font-serif mb-6 selection:bg-brand-100 dark:selection:bg-brand-900/30 tracking-normal">
    {children}
  </p>
);

const Strong = ({ children }: { children?: React.ReactNode }) => (
  <strong className="font-bold text-slate-900 dark:text-white font-sans tracking-tight">{children}</strong>
);

const Code = ({ children }: { children?: React.ReactNode }) => (
  <code className="mx-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[0.85em] font-mono font-medium text-brand-700 dark:text-brand-300 break-words shadow-sm">
    {children}
  </code>
);

const SubHeader = ({ children }: { children?: React.ReactNode }) => (
  <div className="mt-10 mb-5 flex items-center gap-3">
    <div className="h-4 w-1 bg-brand-500 rounded-full"></div>
    <h3 className="text-sm font-bold font-sans uppercase tracking-widest text-slate-900 dark:text-white">
      {children}
    </h3>
  </div>
);

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="mb-8 space-y-3">
    {items.map((item, i) => (
      <li key={i} className="group flex items-start text-[1.05rem] text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
        <span className="shrink-0 mt-2.5 mr-4 w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-brand-500 transition-colors" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'intro',
    title: 'Introduction',
    content: (
      <>
        <P>
          <Strong>You can’t trust a string.</Strong> Or an array. Or half the type declarations you see in legacy PHP codebases.
        </P>
        <P>
          And that’s not PHP’s fault. It’s yours—if you’re still writing function signatures like the one below.
          This signature tells us nothing. Not what’s in <Code>$data</Code>, not if keys are optional, not what the return <Code>bool</Code> even means.
        </P>
        <P>
          PHPStan fixes this. With PHPDocs. Not for decoration. Not for old-school docblocks. But as strict, analyzable type contracts — guardrails for real-world codebases.
        </P>
        
        <SubHeader>Native Types vs PHPStan</SubHeader>
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">Native Type</th>
                <th className="p-4 font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">Can Do</th>
                <th className="p-4 font-bold text-brand-600 dark:text-brand-400 uppercase text-xs tracking-wider">Can't Do (PHPStan Fixes)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0d1117]">
              <tr>
                <td className="p-4 font-mono text-slate-600 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/20">string</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Ensure text input</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Check emptiness, formatting, or security</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-slate-600 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/20">int</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Ensure integer</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Enforce bounds (positive only, min/max)</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-slate-600 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/20">array</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Accept list/map</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Validate keys, value types, or structure</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SubHeader>Why this guide?</SubHeader>
        <List items={[
          <>Catch logic errors <Strong>before</Strong> runtime</>,
          <>Document your code without duplicating logic</>,
          <>Scale PHP safely without turning everything into a typed mess</>
        ]} />
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'The Problem',
        code: `function sendData(array $data): bool
// ❌ What is inside $data?`,
        explanation: "This function signature is risky because 'array' acts as a black box. We don't know if it contains required keys, correct value types, or if it's empty. This ambiguity forces developers to write defensive checks inside the function and leads to runtime errors if the array structure is unexpected."
      }
    ]
  },
  {
    id: 'strings',
    title: '1. String-Based Pseudo-Types',
    content: (
      <>
        <P>
          In PHP, <Code>string</Code> is a blunt instrument. It could mean "admin", "", "123", or a dangerous SQL statement.
        </P>
        <P>
          PHPStan sharpens this instrument with string pseudo-types that define intent, constraints, and trust boundaries.
        </P>
        <SubHeader>Key Types</SubHeader>
        <List items={[
          <><Code>non-empty-string</Code>: A string that cannot be <Code>''</Code>.</>,
          <><Code>numeric-string</Code>: Guaranteed to represent a number ("123.45").</>,
          <><Code>literal-string</Code>: A string known at compile-time (no user input).</>,
          <><Code>class-string&lt;T&gt;</Code>: A fully-qualified class name.</>,
          <><Code>callable-string</Code>: A string name of a globally callable function.</>
        ]} />
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'non-empty-string',
        code: `/**
 * @param non-empty-string $username
 */
function setUsername(string $username): void {
    // Safe, PHPStan guarantees it's not ''
    saveToDatabase($username);
}

setUsername('alice'); // OK
setUsername(''); // PHPStan error`,
        explanation: "By typing $username as `non-empty-string`, you enforce validation at the static analysis level. You no longer need to check `if ($username === '')` inside the function, because the code will refuse to compile if an empty string is passed."
      },
      {
        language: 'php',
        label: 'literal-string (SQL Safety)',
        code: `/**
 * @param literal-string $sqlQuery
 */
function runQuery(string $sqlQuery): void {
    DB::raw($sqlQuery); // Only compile-time constants allowed
}

runQuery("SELECT * FROM users"); // OK
runQuery($_GET['query']); // PHPStan error`,
        explanation: "`literal-string` acts as a security firewall. It ensures the query string is written by the developer (hardcoded) and not constructed from untrusted user input variables. This effectively neutralizes many SQL injection vectors before the code even runs."
      },
      {
        language: 'php',
        label: 'callable-string',
        code: `/**
 * @param callable-string $callback
 */
function invoke(string $callback): void {
    $callback(); // Safe: PHPStan checks it's actually callable
}

invoke('trim'); // OK
invoke('undefinedFunction'); // PHPStan error`,
        explanation: "Unlike a regular string, `callable-string` guarantees that the string value corresponds to a valid, defined function name. This prevents runtime errors when using functions like `call_user_func` or dynamic function calls."
      },
      {
        language: 'php',
        label: 'Intersection with Literals',
        code: `/**
 * @param (literal-string&'database_host') $configKey
 */
function getConfig(string $configKey): mixed {
    return $GLOBALS['config'][$configKey] ?? null;
}

getConfig('database_host'); // OK
getConfig('other_key'); // PHPStan error`,
        explanation: "This advanced type uses an intersection (`&`) to enforce that the variable must be BOTH a `literal-string` AND specifically the value `'database_host'`. It's a way to enforce magic strings at a granular level."
      }
    ],
    quiz: {
      question: "Which type is best for preventing SQL injection in a raw query function?",
      options: [
        { text: "string", isCorrect: false, explanation: "Native string allows any input, including malicious user data." },
        { text: "literal-string", isCorrect: true, explanation: "It forces the input to be a compile-time constant, blocking dynamic user input." },
        { text: "non-empty-string", isCorrect: false, explanation: "User input can be non-empty but still malicious." }
      ]
    }
  },
  {
    id: 'numeric',
    title: '2. Numeric & Range Types',
    content: (
      <>
        <P>
          A parameter like <Code>int $page</Code> tells you nothing. Is 0 okay? -1? 
          PHPStan’s numeric pseudo-types embed actual constraints in the signature.
        </P>
        <SubHeader>Key Types</SubHeader>
        <List items={[
          <><Code>positive-int</Code>: Integer {'>'} 0.</>,
          <><Code>non-negative-int</Code>: Integer {'>='} 0.</>,
          <><Code>int&lt;min, max&gt;</Code>: Integer within a specific range.</>,
          <><Code>numeric</Code>: <Code>int</Code>, <Code>float</Code>, or <Code>numeric-string</Code>.</>
        ]} />
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'positive-int',
        code: `/**
 * @param positive-int $userId
 */
function getUser(int $userId): User {
    return User::find($userId);
}

getUser(42); // OK
getUser(0); // PHPStan error`,
        explanation: "`positive-int` is perfect for database IDs which typically start at 1. It prevents 'off-by-one' errors and invalid ID queries by statically ensuring zero or negative numbers can never be passed."
      },
      {
        language: 'php',
        label: 'Range Constraints',
        code: `/**
 * @param int<1, 10> $rating
 */
function setUserRating(int $rating): void {
    // Only 1–10 allowed
}
setUserRating(10); // OK 
setUserRating(20); // PHPStan error`,
        explanation: "Using `int<1, 10>` documents the domain logic directly in the type system. The static analyzer will catch any attempt to pass an invalid rating (like 20 or 0) instantly, removing the need for `if ($rating < 1 || $rating > 10)` runtime checks."
      },
      {
        language: 'php',
        label: 'Loose Numeric',
        code: `/**
 * @param numeric $value
 */
function normalize($value): float {
    return (float) $value;
}

normalize("5.4"); // OK
normalize(3); // OK
normalize("not a number"); // PHPStan error`,
        explanation: "`numeric` is a loose type that accepts integers, floats, and numeric strings (like '12.34'). It's useful for handling data from sources like CSVs or generic APIs where numbers might be strings but need to be treated mathematically."
      }
    ],
    quiz: {
      question: "You need a type for a database ID that starts at 1. What do you use?",
      options: [
        { text: "int", isCorrect: false, explanation: "Allows negative numbers and zero." },
        { text: "positive-int", isCorrect: true, explanation: "Strictly enforces values > 0." },
        { text: "non-negative-int", isCorrect: false, explanation: "Allows 0, which is usually not a valid DB ID." }
      ]
    }
  },
  {
    id: 'arrays',
    title: '3. Array & List Pseudo-Types',
    content: (
      <>
        <P>
          <Code>array</Code> is a wildcard. It’s uselessly vague. PHPStan gives you tools to lock it down.
        </P>
        <SubHeader>Key Types</SubHeader>
        <List items={[
          <><Code>list&lt;T&gt;</Code>: Indexed from 0, consecutive integers (0, 1, 2...).</>,
          <><Code>non-empty-list&lt;T&gt;</Code>: A list guaranteed to have at least one element.</>,
          <><Code>array&lt;Key, Value&gt;</Code>: Associative map (e.g. <Code>array&lt;string, User&gt;</Code>).</>,
          <><Code>array{'{'}key: T, ...{'}'}</Code>: Defined shape (like a struct).</>
        ]} />
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'List vs Shape',
        code: `/**
 * @return list<string>
 */
function getIds(): array {
    return ['a', 'b', 'c']; // 0-indexed
}

/**
 * @return array{status: bool, message: string}
 */
function response(): array {
    return ['status' => true, 'message' => 'OK'];
}`,
        explanation: "`list<string>` guarantees a sequence (like a JSON array), ensuring you can loop over it without worrying about string keys. `array{status: bool, message: string}` defines a strict 'shape' (like a C struct or JSON object), ensuring both keys exist and have the correct types."
      },
      {
        language: 'php',
        label: 'Non-Empty List',
        code: `/**
 * @param non-empty-list<string> $emails
 */
function notify(array $emails): void {
    foreach ($emails as $email) {
        mail($email, 'Hello!');
    }
}`,
        explanation: "`non-empty-list` combines two guarantees: strict 0-indexed sequential keys (list) and the existence of at least one element. This eliminates the need to check `if (empty($emails))` inside the function, as PHPStan ensures an empty array can never be passed."
      },
      {
        language: 'php',
        label: 'Advanced Shapes (Optional vs Nullable)',
        code: `/**
 * @param array{
 *   id: int,
 *   name: string,
 *   email?: string,      // Key might be missing
 *   avatar: string|null, // Key exists, value is string or null
 *   meta?: array{active: bool} // Nested optional shape
 * } $user
 */
function processUser(array $user): void {
    // ⚠️ Optional keys must be checked
    // echo $user['email']; // PHPStan Error: Offset 'email' might not exist
    
    $email = $user['email'] ?? 'default@example.com'; // OK
    
    // ✅ Nullable keys are safe to access, but need null check
    if ($user['avatar'] !== null) {
        echo $user['avatar'];
    }
}`,
        explanation: "This distinguishes between an *optional key* (`key?: type`) and a *nullable value* (`key: type|null`). Optional keys might cause 'Undefined Array Key' errors if accessed directly, whereas nullable keys always exist but might hold `null`. Use `??` for optional keys and strict `null` checks for nullable values."
      }
    ],
    quiz: {
      question: "Which type should you use for a JSON response with specific fields 'success' and 'data'?",
      options: [
        { text: "array<string, mixed>", isCorrect: false, explanation: "Too vague; doesn't guarantee keys exist." },
        { text: "array{success: bool, data: mixed}", isCorrect: true, explanation: "Defines the exact shape and required keys." },
        { text: "list<mixed>", isCorrect: false, explanation: "Implies a sequential numerical array." }
      ]
    }
  },
  {
    id: 'object-shapes',
    title: '4. Object Shapes',
    content: (
      <>
        <P>
          Just like array shapes define strict structures for arrays, object shapes let you specify exact public property types on objects.
        </P>
        <P>
          Object shapes are powerful for modeling data structures that use public properties instead of arrays. They're especially useful when working with stdClass objects or when you need to validate the structure of generic objects.
        </P>
        <SubHeader>Key Types</SubHeader>
        <List items={[
          <><Code>object{'{'}foo: int, bar: string{'}'}</Code>: Object with required public properties.</>,
          <><Code>object{'{'}foo: int, bar?: string{'}'}</Code>: Object with optional property bar.</>,
          <><Code>object{'{'}foo: int{'}'}&stdClass</Code>: Object shape intersected with stdClass for writable properties.</>
        ]} />
        <SubHeader>Read-Only vs Writable</SubHeader>
        <P>
          By default, object shape properties are <Strong>read-only</Strong>. To make them writable, intersect with a concrete class like <Code>stdClass</Code>.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Basic Object Shape',
        code: `/**
 * @return object{id: int, name: string, active: bool}
 */
function getUser(): object {
    $user = new stdClass();
    $user->id = 1;
    $user->name = 'Alice';
    $user->active = true;
    return $user;
}

$user = getUser();
echo $user->name; // PHPStan knows this is a string`,
        explanation: "Object shapes allow you to define precise types for objects with public properties. PHPStan will ensure that the returned object has exactly these properties with the correct types, providing full IDE autocomplete and type safety."
      },
      {
        language: 'php',
        label: 'Optional Properties',
        code: `/**
 * @param object{name: string, email?: string, avatar?: string} $profile
 */
function displayProfile(object $profile): void {
    echo $profile->name; // Always safe
    
    // Optional properties need existence checks
    if (isset($profile->email)) {
        echo $profile->email;
    }
}`,
        explanation: "Just like array shapes, object shapes support optional properties using the `?` suffix. Optional properties might not exist on the object, so you need to check their existence before accessing them."
      },
      {
        language: 'php',
        label: 'Writable Object Shapes',
        code: `/**
 * @return object{id: int, name: string}&stdClass
 */
function createUser(): object {
    $user = new stdClass();
    $user->id = 1;
    $user->name = 'Bob';
    return $user;
}

$user = createUser();
$user->name = 'Updated'; // OK - writable due to &stdClass
echo $user->name;`,
        explanation: "Intersecting an object shape with `stdClass` (or another concrete class) makes the properties writable. Without this intersection, PHPStan treats object shape properties as read-only to maintain type safety."
      },
      {
        language: 'php',
        label: 'Complex Object Shapes with Lists',
        code: `/**
 * @return list<object{alr_text: string, alr_id: int}&stdClass>
 */
function getAlerts(): array {
    return [
        (object)['alr_text' => 'Warning', 'alr_id' => 1],
        (object)['alr_text' => 'Error', 'alr_id' => 2],
    ];
}

foreach (getAlerts() as $alert) {
    // PHPStan knows $alert has alr_text (string) and alr_id (int)
    echo "{$alert->alr_id}: {$alert->alr_text}";
}`,
        explanation: "You can combine object shapes with list types to represent collections of structured objects. This is common when working with database results that return stdClass objects with specific properties."
      }
    ],
    quiz: {
      question: "How do you make object shape properties writable?",
      options: [
        { text: "object{name: string, writable: true}", isCorrect: false, explanation: "There's no 'writable' property modifier in object shapes." },
        { text: "object{name: string}&stdClass", isCorrect: true, explanation: "Intersecting with a concrete class like stdClass makes properties writable." },
        { text: "object{name!: string}", isCorrect: false, explanation: "The '!' operator doesn't exist for object shapes." }
      ]
    }
  },
  {
    id: 'objects',
    title: '5. Object & Class Types',
    content: (
      <>
        <P>Make your objects speak their real shape.</P>
        <SubHeader>Key Types</SubHeader>
        <List items={[
          <><Code>object</Code>: Completely generic (avoid if possible).</>,
          <><Code>self</Code>: The class this is written in.</>,
          <><Code>$this</Code>: The current instance’s real type (useful for chaining).</>,
          <><Code>static</Code>: The class called at runtime (Late Static Binding).</>,
          <><Code>class-string&lt;T&gt;</Code>: A string that is a fully-qualified class name.</>
        ]} />
        <SubHeader>Union & Intersection Types</SubHeader>
        <P>
          Combine types to express complex relationships.
        </P>
        <List items={[
          <><Strong>Union (<Code>A | B</Code>)</Strong>: Satisfies <Strong>at least one</Strong> constraint. (e.g. <Code>User|null</Code>).</>,
          <><Strong>Intersection (<Code>A & B</Code>)</Strong>: Must satisfy <Strong>all</Strong> constraints. (PHP 8.1+).</>,
          <><Strong>Complex</Strong>: <Code>(A & B) | C</Code> (Group with parentheses).</>
        ]} />
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Method Chaining',
        code: `trait Loggable {
    /** @return $this */
    public function log(string $msg): self {
        echo "[LOG] $msg";
        return $this;
    }
}`,
        explanation: "Using `@return $this` is crucial for traits or base classes. It tells PHPStan that the method returns the exact instance it was called on (e.g., an instance of `User` utilizing the trait), rather than just the trait or base class type, allowing fluent method chaining."
      },
      {
        language: 'php',
        label: 'Intersection & Union',
        code: `/**
 * @param (Content & Publishable)|AdminOverride $item
 */
function publish(object $item): void {
    if ($item instanceof AdminOverride) {
        $item->forcePublish();
        return;
    }
    
    // PHPStan knows $item is Content AND Publishable here
    $item->getTitle(); 
    $item->publish();
}`,
        explanation: "This demonstrates complex type algebra. The input can be EITHER an object implementing both `Content` and `Publishable`, OR an instance of `AdminOverride`. Parentheses `()` are used to group the intersection before applying the union."
      },
      {
        language: 'php',
        label: 'Static vs Self',
        code: `class Repository {
    /** @return static */
    public static function new(): static {
        return new static(); // Returns child class if called on child
    }
}
class UserRepository extends Repository {}
$userRepo = UserRepository::new(); // Inferred as UserRepository`,
        explanation: "The `static` return type supports Late Static Binding. If you extend `Repository`, calling `UserRepository::new()` will return `UserRepository`, not the parent `Repository`. `self` would strictly return the class where the method is defined."
      },
      {
        language: 'php',
        label: 'Dynamic Instantiation',
        code: `/**
 * @template T of Service
 * @param class-string<T> $class
 * @return T
 */
function create(string $class): object {
    return new $class(); // Strongly typed return
}`,
        explanation: "`class-string<T>` is a powerhouse for Dependency Injection. It ensures that the string passed is not just any text, but a valid class name that specifically extends `Service`. The return type `T` then matches that specific class, giving you full IDE autocomplete on the result."
      }
    ]
  },
  {
    id: 'callables',
    title: '6. Callable Types',
    content: (
      <>
        <P>Just saying <Code>callable</Code> is not enough. Document the signature.</P>
        <P><Strong>Syntax</Strong>: <Code>callable(ParamTypes): ReturnType</Code></P>
        <SubHeader>Blind Spot: Callable Strings</SubHeader>
        <P>
          <Code>callable-string</Code> is tricky. It works for global functions, but often fails for object methods or closures. Prefer <Code>Closure</Code> or strict <Code>callable(...)</Code> syntax.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Callable Signature',
        code: `/**
 * @param callable(int, string): bool $validator
 */
function process(callable $validator): void {
    $result = $validator(123, 'abc');
    // PHPStan knows $result is bool
}`,
        explanation: "Standard `callable` is a black box. `callable(int, string): bool` defines a strict contract: the function must accept an integer and a string, and return a boolean. This prevents runtime crashes caused by passing a callback that expects different arguments."
      },
      {
        language: 'php',
        label: 'Trap: callable-string',
        code: `class Handler {
    private function doIt() {}
    
    public function getCallback(): callable {
        // ❌ Error: 'doIt' is a string, not a valid callable outside this scope
        // return 'doIt'; 
        
        // ✅ Correct: First-class callable syntax
        return $this->doIt(...);
    }
}`,
        explanation: "Many developers try to return the string method name. But `callable-string` implies it can be called *from where it is used*. Private methods cannot. Using `Closure` (via `$this->method(...)`) captures the scope correctly."
      }
    ]
  },
  {
    id: 'generics',
    title: '7. Generics',
    content: (
      <>
        <P>Static typing for dynamic collections.</P>
        <SubHeader>Key Annotations</SubHeader>
        <List items={[
          <><Code>@template T</Code>: Declares a generic placeholder.</>,
          <><Code>@extends Collection&lt;T&gt;</Code>: Specifies generic type when extending.</>,
          <><Code>@implements Repository&lt;T&gt;</Code>: Specifies concrete type for interfaces.</>
        ]} />
        <SubHeader>Advanced: Call-Site Variance</SubHeader>
        <P>
          PHP lacks native covariant generics. PHPStan solves this with <Code>out</Code> (covariant) and <Code>in</Code> (contravariant) projections at the call site.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Generic Collection',
        code: `/**
 * @template T
 */
class Collection {
    /** @var list<T> */
    private array $items = [];

    /** @param T $item */
    public function add($item): void {
        $this->items[] = $item;
    }
}

/**
 * @extends Collection<User>
 */
class UserCollection extends Collection {
    public function findByEmail(string $email): ?User {
        foreach ($this->items as $item) {
            // $item is guaranteed to be User here
            if ($item->email === $email) return $item;
        }
        return null;
    }
}`,
        explanation: "`@template T` brings generics to PHP. We use `/** @var list<T> */` to define the property type dynamically. When you extend `Collection<User>`, PHPStan replaces `T` with `User`, meaning `$items` is now understood as `list<User>` and `add($item)` strictly accepts `User` objects."
      },
      {
        language: 'php',
        label: 'Interface Implementation',
        code: `/**
 * @implements Repository<User>
 */
class UserRepository implements Repository {
    public function find(int $id): ?User { 
        // ...
    }
}`,
        explanation: "When implementing a generic interface, you must define the concrete type for `T`. `@implements Repository<User>` tells PHPStan that for this specific class, the generic `T` is always `User`, enforcing strict types for methods like `find` that use that generic."
      },
      {
        language: 'php',
        label: 'Call-Site Variance',
        code: `/** @param Collection<out Animal> $animals */
function treat(Collection $animals): void {
    // Safe: We can read Animals from it
    $animal = $animals->get(0);
    
    // Error: We cannot ADD to it, because it might be a Collection<Dog>
    // $animals->add(new Cat()); // ❌ PHPStan stops this
}`,
        explanation: "Using `<out Animal>` allows you to pass a `Collection<Dog>` to a function expecting `Collection<Animal>`. This is 'covariance'. It's safe because PHPStan prevents you from *adding* a generic `Animal` (which might be a Cat) into what is actually a list of Dogs."
      }
    ],
    quiz: {
      question: "What tag allows a function to accept any type but return that SAME type?",
      options: [
        { text: "@var T", isCorrect: false, explanation: "Describes a variable, doesn't define a template." },
        { text: "@template T", isCorrect: true, explanation: "Defines a generic type variable T that correlates input and output." },
        { text: "@return mixed", isCorrect: false, explanation: "Loses type information." }
      ]
    }
  },
  {
    id: 'enums',
    title: '8. Constants & Enums',
    content: (
      <>
        <P>Avoid magic strings. Use literal types or constants.</P>
        <SubHeader>Techniques</SubHeader>
        <List items={[
          <><Strong>Complex Unions</Strong>: <Code>'asc'|'desc'|null</Code></>,
          <><Strong>Ranges</Strong>: <Code>int&lt;0, 100&gt;</Code></>,
          <><Strong>Wildcards</Strong>: <Code>Status::CONST_*</Code></>,
          <><Strong>Native Enums</Strong>: PHP 8.1+</>,
          <><Strong>Array Constraints</Strong>: <Code>key-of</Code> / <Code>value-of</Code></>
        ]} />
        <SubHeader>Blind Spots: Wildcards & Exhaustiveness</SubHeader>
         <P>
          <Strong>Wildcards:</Strong> <Code>CONST_*</Code> matching is <Strong>case-sensitive</Strong>. The asterisk works as a prefix (e.g. at the end), but not in the middle or as a suffix without custom rules.
        </P>
        <P>
          <Strong>Exhaustiveness:</Strong> When using literal types like <Code>'a'|'b'</Code>, PHPStan can enforce that you handle every possible case in a <Code>match</Code> expression.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Complex Value Unions',
        code: `/**
 * @param 'auto'|int<0, 100>|null $width
 */
function setWidth(string|int|null $width): void {
    // Accepts "auto", null, or an integer between 0 and 100.
    // Rejects "100%" (string), -1, or 101.
}`,
        explanation: "Union types aren't limited to just strings or just classes. You can mix literals (`'auto'`), numeric ranges (`int<0, 100>`), and `null`. This precise definition replaces vague types like `mixed` or `string|int`."
      },
      {
        language: 'php',
        label: 'Literal Exhaustiveness',
        code: `/** @param 'open'|'closed' $state */
function getLabel(string $state): string {
    // ✅ PHPStan forces you to handle 'open' AND 'closed'
    return match($state) {
        'open' => 'Active',
        'closed' => 'Done',
        // If you miss a case, PHPStan errors!
    };
}`,
        explanation: "This is one of the most powerful features of literal types. Because PHPStan knows `$state` can ONLY be 'open' or 'closed', it will error if your `match` expression doesn't handle all possibilities. This makes adding new states refactor-safe."
      },
      {
        language: 'php',
        label: 'Native Enums',
        code: `enum UserStatus: string {
    case ACTIVE = 'active';
    case BANNED = 'banned';
}

function setStatus(UserStatus $status): void {}

setStatus(UserStatus::ACTIVE); // OK
setStatus('active'); // ERROR`,
        explanation: "PHP 8.1 Enums are the gold standard for fixed sets of values. They provide runtime type safety that string literals or constants can't match perfectly. Always prefer native Enums for new code over PHPDoc literals."
      },
      {
        language: 'php',
        label: 'Array Keys (key-of)',
        code: `const ROLES = ['admin' => 1, 'editor' => 2];

/**
 * @param key-of<self::ROLES> $role
 */
function assignRole(string $role): void {}

assignRole('admin'); // OK
assignRole('guest'); // PHPStan error`,
        explanation: "`key-of<self::ROLES>` tells PHPStan that `$role` must strictly be one of the keys defined in the `ROLES` constant array. If you add a new role to the array, the valid types are automatically updated."
      },
      {
        language: 'php',
        label: 'Constant Wildcards (All Constants)',
        code: `class Permissions {
    public const READ = 'read';
    public const WRITE = 'write';
    public const DELETE = 'delete';
    public const ADMIN_READ = 'admin_read';
    public const ADMIN_WRITE = 'admin_write';
}

/**
 * @param Permissions::* $permission
 */
function checkPermission(string $permission): void {
    // Accepts ANY constant from Permissions class
    // 'read', 'write', 'delete', 'admin_read', 'admin_write'
}

/**
 * @param Permissions::ADMIN_* $adminPermission
 */
function checkAdminPermission(string $adminPermission): void {
    // Only accepts constants starting with ADMIN_
    // 'admin_read', 'admin_write'
}

checkPermission(Permissions::READ); // OK
checkPermission(Permissions::ADMIN_WRITE); // OK
checkAdminPermission(Permissions::ADMIN_READ); // OK
checkAdminPermission(Permissions::READ); // PHPStan error`,
        explanation: "The wildcard syntax `Foo::*` accepts all constants from a class. You can also use prefixes like `Foo::ADMIN_*` to match only constants starting with that prefix. This is extremely useful for grouping related constants while maintaining type safety."
      }
    ]
  },
  {
    id: 'conditional',
    title: '9. Conditional Types',
    content: (
      <>
        <P>Sometimes types depend on values. PHPStan allows conditional return types.</P>
        <P><Strong>Syntax</Strong>: <Code>@return (condition ? T1 : T2)</Code></P>
        <P>It also supports assertions:</P>
        <List items={[
          <><Code>@phpstan-assert T $var</Code>: Assert $var is type T after call</>,
          <><Code>@phpstan-assert-if-true T $var</Code>: If method returns true, <Code>$var</Code> is type <Code>T</Code>.</>,
          <><Code>@phpstan-assert-if-false T $var</Code>: If method returns false, <Code>$var</Code> is type <Code>T</Code>.</>
        ]} />
        <SubHeader>Real-World Limitations</SubHeader>
        <P>
          <Strong>Performance & Nesting:</Strong> While powerful, conditional types like <Code>(T is int ? string : int)</Code> increase analysis time exponentially when nested. Stick to simple conditions in production.
        </P>
        <P>
          <Strong>Scope of Assertions:</Strong> Assertions like <Code>@phpstan-assert</Code> are <Strong>function-local</Strong>. They do not automatically propagate globally unless explicitly chained.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Conditional Return',
        code: `/**
 * @return ($asJson is true ? string : array)
 */
function getData(bool $asJson): string|array {
    // ...
}`,
        explanation: "This advanced type models PHP's dynamic behavior safely. It tells the analyzer: 'If the input $asJson is strictly true, the output is definitely a string. If false, it's an array.' This removes ambiguity and the need for repetitive `is_string()` checks after the call."
      },
      {
        language: 'php',
        label: 'Conditional Generics (Dependent Types)',
        code: `/**
 * @template T of int|string
 * @param T $input
 * @return (T is int ? string : int)
 */
function invertType(int|string $input): string|int {
    return is_int($input) ? (string)$input : (int)$input;
}

$val1 = invertType(42); // inferred as string
$val2 = invertType('123'); // inferred as int`,
        explanation: "This is a 'dependent type' where the return type morphs based on the specific type of the generic input. It effectively maps input types to output types at the static analysis level."
      },
      {
        language: 'php',
        label: 'Type Assertion (If-True)',
        code: `/**
 * @phpstan-assert-if-true non-empty-string $email
 */
public static function isValidEmail(?string $email): bool {
    return is_string($email) && $email !== '' && str_contains($email, '@');
}`,
        explanation: "These assertions allow you to teach PHPStan about your custom validation logic. By annotating `isValidEmail`, you tell the analyzer that if this function returns true, the passed string is guaranteed to be a `non-empty-string`, automatically narrowing the type in the calling code."
      },
      {
        language: 'php',
        label: 'Negative Assertion (If-False)',
        code: `/**
 * @phpstan-assert-if-false int<min, 0> $score
 */
function isPositive(int $score): bool {
    return $score > 0;
}

if (!isPositive($val)) {
    // PHPStan knows $val is <= 0 here
}`,
        explanation: "This assertion tells PHPStan that if the function returns `false`, the `$score` variable is guaranteed to be zero or negative. This is incredibly useful for narrowing types in `else` blocks or after early returns."
      },
      {
        language: 'php',
        label: 'Blind Spot: Assertion Scope',
        code: `/** @phpstan-assert-if-true positive-int $x */
function check(int $x): bool { return $x > 0; }

if (check($x) && someComplexCondition()) {
    // ⚠️ $x might NOT be positive-int here!
    // PHPStan may drop the assertion if control flow gets too complex
}`,
        explanation: "Assertions are fragile. If combined with complex boolean logic or external function calls that might have side effects, PHPStan may invalidate the narrowed type to be safe. Keep assertion logic simple and direct."
      }
    ]
  },
  {
    id: 'reference',
    title: '10. Pass-by-Reference',
    content: (
      <>
        <P>Stop guessing what happens to that <Code>&$var</Code>.</P>
        <P>Use <Code>@param-out T $var</Code> to explicitly document the final type of a referenced variable after a function call.</P>
        <SubHeader>Real-World Blind Spot</SubHeader>
        <P>
          <Strong>Initialization:</Strong> <Code>@param-out</Code> does not enforce initialization. You can technically leave a variable uninitialized, passing analysis but crashing at runtime.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Param Out',
        code: `/**
 * @param-out int $parsed
 */
function parse(string $in, &$parsed): void {
    $parsed = (int)$in;
}`,
        explanation: "Normally, variables passed by reference lose their specific type information after the function call. `@param-out` fixes this by telling PHPStan exactly what type the variable holds *after* the function has modified it."
      },
      {
        language: 'php',
        label: 'Error Collection Pattern',
        code: `/**
 * @param-out list<string> $errors
 */
function validate(array $input, array &$errors): bool {
    $errors = [];
    if (!isset($input['id'])) {
        $errors[] = 'Missing ID';
    }
    return empty($errors);
}`,
        explanation: "This is a classic pattern in legacy code: checking validity and populating an error array by reference. Using `@param-out list<string> $errors` ensures that after this function runs, PHPStan treats `$errors` as a specific list of strings, not just a generic array, enabling safer iteration later."
      }
    ]
  },
  {
    id: 'suppression',
    title: '11. False Positive Suppression',
    content: (
      <>
        <P>Sometimes static analysis is wrong. Suppress surgically.</P>
        <List items={[
          <><Code>@phpstan-ignore-next-line</Code>: Use sparingly.</>,
          <><Code>@phpstan-ignore-line</Code>: Inline on same line.</>,
          <><Code>@phpstan-ignore-error Identifier</Code>: The best way. Ignores only specific error types.</>
        ]} />
        <SubHeader>The Baseline Workflow</SubHeader>
        <P>
          Instead of ignoring errors one by one in legacy projects, use the Baseline.
        </P>
        <List items={[
          <><Strong>Generate</Strong>: Run <Code>phpstan analyse --generate-baseline</Code>.</>,
          <><Strong>Commit</Strong>: Commit the <Code>phpstan-baseline.neon</Code> file to git.</>,
          <><Strong>Shrink</Strong>: As you refactor, remove errors from the baseline. PHPStan 2.0+ adds error IDs to baselines for granular management.</>
        ]} />
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Surgical Suppression',
        code: `/** @phpstan-ignore-error function.alreadyNarrowedType */
if (is_string($value)) { ... }`,
        explanation: "Instead of ignoring the whole line (which might hide real bugs), this annotation ignores only the specific error ID `function.alreadyNarrowedType`. This allows you to bypass a specific false positive while keeping all other strict checks active."
      },
      {
        language: 'yaml',
        label: 'Global Config (phpstan.neon)',
        code: `parameters:
    ignoreErrors:
        # ❌ Too broad - dangerous!
        - '#Call to undefined method#'

        # ✅ Scoped & Specific - safe
        -
            message: '#Access to an undefined property#'
            path: src/Legacy/*`,
        explanation: "When you can't use inline annotations (e.g., inside vendor code or widespread legacy issues), use `phpstan.neon`. Always scope your ignores by `message` AND `path` to prevent suppressing legitimate new errors in modern code."
      }
    ]
  },
  {
    id: 'best-practices',
    title: '12. Contracts & Organization',
    content: (
      <>
        <P>Make your types honest. Define strict contracts.</P>
        <List items={[
          <><Strong>Native Types First</Strong>: Don't duplicate native types in docblocks unless refining them.</>,
          <><Strong>Precise Arrays</Strong>: Use <Code>array{'{'}...{'}'}</Code> shapes or DTOs, not <Code>array</Code>.</>,
          <><Strong>Checked Exceptions</Strong>: Use <Code>@throws</Code> to enforce error handling logic.</>,
          <><Strong>Purity</Strong>: <Code>@pure</Code> guarantees no side-effects (no I/O, no global writes).</>
        ]} />
        <SubHeader>Type Organization</SubHeader>
        <P>
          Clean up messy signatures with <Code>@phpstan-type</Code> and share them with <Code>@phpstan-import-type</Code>.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Refactor to DTO',
        code: `// ❌ Complex Array Shape
/** @return array{user: array{id: int}, meta: array{active: bool}} */

// ✅ Named Type Alias (Can be imported!)
/** @phpstan-type UserData array{id: int, name: string} */

// ✅ Value Object / DTO (Best)
class UserDTO {
    public function __construct(public int $id, public string $name) {}
}`,
        explanation: "Complex array shapes are hard to read and maintain. Refactoring a massive `array{...}` definition into a dedicated Data Transfer Object (DTO) or using `@phpstan-type` aliases makes your code reusable and significantly cleaner. You can then use `/** @phpstan-import-type UserData from UserDTO */` in other files."
      },
      {
        language: 'php',
        label: 'Checked Exceptions & Purity',
        code: `/**
 * @pure
 * @throws InvalidArgumentException
 */
function calculate(int $val): int {
    if ($val < 0) throw new InvalidArgumentException();
    return $val * 2;
}`,
        explanation: "`@throws` turns PHP's loose exceptions into Checked Exceptions, forcing callers to catch them or redeclare them. `@pure` tells PHPStan this function has no side effects (doesn't touch DB, globals, or IO), allowing for aggressive optimizations and dead-code removal."
      }
    ]
  },
  {
    id: 'cheatsheet',
    title: '13. Cheatsheet',
    content: (
      <>
        <P>
          Let’s wrap this beast up with a brutally clear cheatsheet of everything PHPStan’s extended PHPDoc syntax gives you—and how to actually use it in production.
        </P>

        <SubHeader>Scalar & Refined Pseudo-Types</SubHeader>
        <List items={[
          <><Code>non-empty-string</Code>: String that’s never <Code>''</Code></>,
          <><Code>numeric-string</Code>: String that parses to number ("123", "1.5")</>,
          <><Code>literal-string</Code>: String known at compile time</>,
          <><Code>positive-int</Code>: Integer {'>'} 0</>,
          <><Code>non-negative-int</Code>: Integer {'>='} 0</>,
          <><Code>int&lt;min, max&gt;</Code>: Integer between min and max</>,
          <><Code>class-string&lt;T&gt;</Code>: Fully qualified class name (subtype of T)</>,
          <><Code>callable-string</Code>: String name of a global callable</>
        ]} />

        <SubHeader>Array & List Types</SubHeader>
        <List items={[
          <><Code>list&lt;T&gt;</Code>: 0-based sequential array</>,
          <><Code>non-empty-list&lt;T&gt;</Code>: list&lt;T&gt; with at least one element</>,
          <><Code>array&lt;K, V&gt;</Code>: Associative array</>,
          <><Code>non-empty-array&lt;K, V&gt;</Code>: Associative array with at least one element</>,
          <><Code>array{'{'}key: T{'}'}</Code>: Structured array with required keys</>,
          <><Code>array{'{'}key?: T{'}'}</Code>: Structured array with optional keys</>,
          <><Code>array-key</Code>: <Code>int|string</Code></>
        ]} />

        <SubHeader>Object Shape Types</SubHeader>
        <List items={[
          <><Code>object{'{'}foo: int, bar: string{'}'}</Code>: Object with required properties</>,
          <><Code>object{'{'}foo: int, bar?: string{'}'}</Code>: Object with optional property</>,
          <><Code>object{'{'}foo: int{'}'}&stdClass</Code>: Writable object shape (intersected with class)</>,
          <><Code>list&lt;object{'{'}id: int{'}'}&stdClass&gt;</Code>: List of object shapes</>
        ]} />

        <SubHeader>Object, Class & Callable Types</SubHeader>
        <List items={[
          <><Code>object</Code>: Any object</>,
          <><Code>self</Code>: Current class (not child)</>,
          <><Code>$this</Code>: Instance of calling class</>,
          <><Code>static</Code>: Late static binding return</>,
          <><Code>callable(A): R</Code>: Callable signature</>,
          <><Code>A & B</Code>: Intersection (must be A AND B)</>,
          <><Code>A | B</Code>: Union (A or B)</>
        ]} />

        <SubHeader>Generics & Reusability</SubHeader>
        <List items={[
          <><Code>@template T</Code>: Declare type variable</>,
          <><Code>@template T of Foo</Code>: Restrict T to subtype of Foo</>,
          <><Code>@extends Base&lt;T&gt;</Code>: Specifies type T for parent</>,
          <><Code>@implements I&lt;T&gt;</Code>: Specifies type T for interface</>,
          <><Code>@phpstan-type Alias Type</Code>: Alias for complex types</>,
          <><Code>@phpstan-import-type</Code>: Import alias from another scope</>
        ]} />

        <SubHeader>Constraints & Logic</SubHeader>
        <List items={[
          <><Code>'a'|'b'</Code>: Literal values</>,
          <><Code>Class::CONST_*</Code>: All constants matching prefix</>,
          <><Code>Foo::*</Code>: All constants on Foo</>,
          <><Code>key-of&lt;T&gt;</Code> / <Code>value-of&lt;T&gt;</Code>: Keys/Values of array</>,
          <><Code>@phpstan-assert T $v</Code>: Assert type after call</>,
          <><Code>@phpstan-assert-if-true T $v</Code>: Assert if returns true</>,
          <><Code>@phpstan-assert-if-false T $v</Code>: Assert if returns false</>,
          <><Code>@return (A?B:C)</Code>: Conditional return type</>,
          <><Code>@param-out T $v</Code>: Type after function finishes</>,
          <><Code>@throws T</Code>: Declares checked exception</>,
          <><Code>@pure</Code>: Marks function as side-effect free</>
        ]} />

        <SubHeader>Suppression</SubHeader>
        <List items={[
          <><Code>@phpstan-ignore-error Id</Code>: Ignore specific error (Best)</>,
          <><Code>@phpstan-ignore-next-line</Code>: Ignore next line</>,
          <><Code>@phpstan-ignore-line</Code>: Ignore current line</>
        ]} />

        <P>
          <Strong>Final Thoughts:</Strong> Treat PHPDocs as contracts, not comments. Don’t use <Code>array</Code> when you mean <Code>non-empty-list&lt;literal-string&gt;</Code>. Refactor complex array shapes into DTOs when they get hairy. Rely on tools, not convention. Let PHPStan hold the line.
        </P>
      </>
    ),
    codeBlocks: [
      {
        language: 'php',
        label: 'Copy-Paste Master Template',
        code: `/**
 * @template T of object
 * @phpstan-type Shape array{id: int, name: string}
 */
class MasterCheatsheet {
    /** @var list<T> */
    private array $items = [];

    /**
     * @param non-empty-string $key
     * @param positive-int $count
     * @param 'asc'|'desc' $order
     * @return ($order is 'asc' ? list<Shape> : array<string, Shape>)
     * @throws RuntimeException
     */
    public function query(string $key, int $count, string $order): array {
        // ... implementation
    }
}`,
        explanation: "This snippet combines almost everything: Generics (`@template`), Type Aliases (`@phpstan-type`), Strict Scalars (`non-empty-string`, `positive-int`), Literals (`'asc'|'desc'`), Conditional Return Types, and Checked Exceptions (`@throws`). Copy this to test your PHPStan configuration!"
      }
    ]
  }
];