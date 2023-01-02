import Layout from "../components/layout";

export default function AllLists() {
    return (
        <Layout>
            <h2>Create List</h2>
            <form action="/api/new-list" method="POST">
                <div className='form-row'>
                    <label>Type: </label>
                    <select id="types" list="types" name="type" required>
                        <option value="Any">Any</option>
                        <option value="Books">Books</option>
                        <option value="Movies">Movies</option>
                        <option value="Music">Music</option>
                    </select>
                </div>
                <div className='form-row'>
                    <label>Name: </label>
                    <input type="text" name="name" required />
                </div>
                <div className='form-row'>
                    <label>Description: </label>
                    <textarea type="text" name="description"></textarea>
                </div>
                <div className='form-row'>
                    <input type="submit" value="Create List" />
                </div>
            </form>
        </Layout>
    )
}