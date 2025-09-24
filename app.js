// Utility: Ripple effect for buttons
function useRipple(ref, color = "rgba(255,255,255,0.5)") {
React.useEffect(() => {
const element = ref.current;
if (!element) return;

const createRipple = (event) => {  
  const circle = document.createElement("span");  
  const diameter = Math.max(element.clientWidth, element.clientHeight);  
  const radius = diameter / 2;  

  circle.style.width = circle.style.height = `${diameter}px`;  
  circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;  
  circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;  
  circle.style.position = "absolute";  
  circle.style.borderRadius = "50%";  
  circle.style.backgroundColor = color;  
  circle.style.transform = "scale(0)";  
  circle.style.opacity = "0.75";  
  circle.style.pointerEvents = "none";  
  circle.style.transition = "transform 0.6s, opacity 0.6s";  

  element.appendChild(circle);  

  requestAnimationFrame(() => {  
    circle.style.transform = "scale(2)";  
    circle.style.opacity = "0";  
  });  

  setTimeout(() => circle.remove(), 600);  
};  

element.addEventListener("click", createRipple);  
return () => element.removeEventListener("click", createRipple);

}, [ref, color]);
}

// Animated Button Component
function AnimatedButton({ onClick, children, style }) {
const ref = React.useRef();
useRipple(ref, "rgba(255,255,255,0.4)");
return (
<button
ref={ref}
onClick={onClick}
style={{
position: "relative",
overflow: "hidden",
...style
}}
>
{children}
</button>
);
}

// Screen fade animation wrapper
function Fade({ children }) {
const ref = React.useRef();
React.useEffect(() => {
const el = ref.current;
if (!el) return;
el.style.opacity = 0;
el.style.transition = "opacity 0.4s";
requestAnimationFrame(() => el.style.opacity = 1);
}, []);
return <div ref={ref}>{children}</div>;
}

// Swipeable Task Item Component
function SwipeItem({ children, onDelete }) {
const ref = React.useRef();
const [dragX, setDragX] = React.useState(0);
const [isDragging, setIsDragging] = React.useState(false);
const startX = React.useRef(0);

const onMouseDown = (e) => {
setIsDragging(true);
startX.current = e.clientX;
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e) => {
if (!isDragging) return;
setDragX(e.clientX - startX.current);
};

const onMouseUp = () => {
setIsDragging(false);
document.removeEventListener("mousemove", onMouseMove);
document.removeEventListener("mouseup", onMouseUp);

if (Math.abs(dragX) > 100) {  
  ref.current.style.transition = "transform 0.3s, opacity 0.3s";  
  ref.current.style.opacity = 0;  
  ref.current.style.transform = `translateX(${dragX > 0 ? 500 : -500}px)`;  
  setTimeout(onDelete, 300);  
} else {  
  ref.current.style.transition = "transform 0.3s";  
  ref.current.style.transform = "translateX(0px)";  
  setTimeout(() => ref.current.style.transition = "", 300);  
}  
setDragX(0);

};

return (
<div
ref={ref}
onMouseDown={onMouseDown}
style={{
transform: translateX(${dragX}px),
cursor: "grab",
userSelect: "none",
}}
>
{children}
</div>
);
}

// Home Screen
function Home({ navigate, darkMode, toggleDarkMode }) {
const containerStyle = {
backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
color: darkMode ? "#FFFFFF" : "#000000",
padding: 20,
margin: 20,
borderRadius: 12,
boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
maxWidth: 350,
fontFamily: "Roboto, sans-serif",
textAlign: "center",
};

const buttonStyle = {
padding: 12,
borderRadius: 8,
border: "none",
backgroundColor: "#6200EE",
color: "#FFFFFF",
fontWeight: "bold",
cursor: "pointer",
boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
margin: 5,
transition: "transform 0.2s",
};

return (
<Fade>
<div style={containerStyle}>
<h1 style={{ marginBottom: 10 }}>Welcome!</h1>
<p style={{ marginBottom: 15 }}>This is the Home Screen</p>
<AnimatedButton style={buttonStyle} onClick={() => navigate("tasks")}>Go to Tasks</AnimatedButton>
<br />
<AnimatedButton style={buttonStyle} onClick={toggleDarkMode}>
Toggle {darkMode ? "Light" : "Dark"} Mode
</AnimatedButton>
</div>
</Fade>
);
}

// Tasks Screen
function Tasks({ navigate, darkMode, toggleDarkMode }) {
const [count, setCount] = React.useState(0);
const [tasks, setTasks] = React.useState([]);
const [taskInput, setTaskInput] = React.useState("");

const containerStyle = {
backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
color: darkMode ? "#FFFFFF" : "#000000",
padding: 20,
margin: 20,
borderRadius: 12,
boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
maxWidth: 350,
fontFamily: "Roboto, sans-serif",
textAlign: "center",
};

const buttonStyle = {
padding: 12,
borderRadius: 8,
border: "none",
backgroundColor: "#6200EE",
color: "#FFFFFF",
fontWeight: "bold",
cursor: "pointer",
boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
margin: 5,
transition: "transform 0.2s",
};

const inputStyle = {
padding: 8,
width: 200,
marginRight: 5,
borderRadius: 6,
border: "1px solid #ccc",
};

const deleteStyle = {
color: "red",
cursor: "pointer",
marginLeft: 10,
fontWeight: "bold",
};

const increment = () => setCount(count + 1);
const addTask = () => {
if (taskInput.trim() !== "") {
setTasks([...tasks, taskInput]);
setTaskInput("");
}
};
const deleteTask = (index) => setTasks(tasks.filter((_, i) => i !== index));

return (
<Fade>
<div style={containerStyle}>
<h1 style={{ marginBottom: 10 }}>Tasks Screen</h1>
<AnimatedButton style={buttonStyle} onClick={() => navigate("home")}>Back to Home</AnimatedButton>
<AnimatedButton style={buttonStyle} onClick={toggleDarkMode}>
Toggle {darkMode ? "Light" : "Dark"} Mode
</AnimatedButton>

<h3 style={{ marginTop: 20 }}>Counter</h3>  
    <p>Button clicked {count} times</p>  
    <AnimatedButton style={buttonStyle} onClick={increment}>Increment Counter</AnimatedButton>  

    <h3 style={{ marginTop: 20 }}>Task List</h3>  
    <input  
      type="text"  
      placeholder="Enter a task"  
      value={taskInput}  
      onChange={(e) => setTaskInput(e.target.value)}  
      style={inputStyle}  
    />  
    <AnimatedButton style={buttonStyle} onClick={addTask}>Add Task</AnimatedButton>  

    <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>  
      {tasks.map((task, index) => (  
        <SwipeItem key={index} onDelete={() => deleteTask(index)}>  
          <li  
            style={{  
              margin: 5,  
              padding: 10,  
              borderRadius: 8,  
              backgroundColor: darkMode ? "#333" : "#f0f0f0",  
              display: "flex",  
              justifyContent: "space-between",  
              alignItems: "center",  
              transition: "background 0.3s, transform 0.2s",  
            }}  
          >  
            {task}  
            <span style={deleteStyle} onClick={() => deleteTask(index)}>X</span>  
          </li>  
        </SwipeItem>  
      ))}  
    </ul>  
  </div>  
</Fade>

);
}

// Main App
function App() {
const [screen, setScreen] = React.useState("home");
const [darkMode, setDarkMode] = React.useState(false);

const navigate = (name) => setScreen(name);
const toggleDarkMode = () => setDarkMode(!darkMode);

return (
<div style={{
backgroundColor: darkMode ? "#121212" : "#f5f5f5",
minHeight: "100vh",
paddingBottom: 20,
transition: "background-color 0.4s",
}}>
{screen === "home" && <Home navigate={navigate} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
{screen === "tasks" && <Tasks navigate={navigate} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
</div>
);
}

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

