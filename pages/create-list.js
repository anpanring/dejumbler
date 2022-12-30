import Layout from "../components/layout";

export default function AllLists() {
    return (
        <Layout>
            <h2>Create List</h2>
            <form action="/api/new-list" method="POST">
                <div class='form-row'>
                    <label>Type: </label>
                    <input list="types" name="type" required />
                    <datalist id="types">
                        <option value="Books" />
                        <option value="Movies" />
                        <option value="Music" />
                        <option value="Any" />
                    </datalist>
                </div>
                <div class='form-row'>
                    <label>Name: </label>
                    <input type="text" name="name" required />
                </div>
                <div class='form-row'>
                    <label>Description: </label>
                    <textarea type="text" name="description"></textarea>
                </div>
                <div class='form-row'>
                    <input type="submit" value="Create List" />
                </div>
            </form>
        </Layout>
    )
}