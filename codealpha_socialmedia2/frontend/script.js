const apiUrl = 'http://localhost:5000/api';
const postList = document.getElementById('post-list');

async function createUser () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('User  created:', data);
    alert('User  created successfully!');
}

async function createPost() {
    const postContent = document.getElementById('postContent').value;
    const userId = 'YOUR_USER_ID'; // Replace with the actual user ID

    const response = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userId, content: postContent }),
    });

    const data = await response.json();
    console.log('Post created:', data);
    alert('Post created successfully!');
    fetchPosts(); // Refresh the post list
}

async function fetchPosts() {
    const response = await fetch(`${apiUrl}/posts`);
    const posts = await response.json();
    displayPosts(posts);
}

function displayPosts(posts) {
    postList.innerHTML = ''; // Clear the current list
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h3>${post.user.username}</h3>
            <p>${post.content}</p>
            <p><strong>Likes:</strong> ${post.likes.length}</p>
            <button onclick="likePost('${post._id}')">Like</button>
            <h4>Comments:</h4>
            <div id="comments-${post._id}"></div>
            <textarea id="commentContent-${post._id}" placeholder="Add a comment..."></textarea>
            <button onclick="addComment('${post._id}')">Comment</button>
        `;
        postList.appendChild(postDiv);
        displayComments(post.comments, post._id);
    });
}

async function likePost(postId) {
    const userId = 'YOUR_USER_ID'; // Replace with the actual user ID
    const response = await fetch(`${apiUrl}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    console.log('Post liked:', data);
    fetchPosts(); // Refresh the post list
}

async function addComment(postId) {
    const commentContent = document.getElementById(`commentContent-${postId}`).value;
    const userId = 'YOUR_USER_ID'; // Replace with the actual user ID

    const response = await fetch(`${apiUrl}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, content: commentContent }),
    });

    const data = await response.json();
    console.log('Comment added:', data);
    fetchPosts(); // Refresh the post list to show the new comment
}

function displayComments(comments, postId) {
    const commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.innerHTML = ''; // Clear existing comments
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.innerHTML = `<strong>${comment.user.username}:</strong> ${comment.content}`;
        commentsDiv.appendChild(commentDiv);
    });
}

// Fetch posts when the page loads
window.onload = fetchPosts;