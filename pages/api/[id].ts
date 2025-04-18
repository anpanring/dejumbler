import type { NextApiRequest, NextApiResponse } from 'next';

// import dbConnect from '../../lib/mongodb'
// import List from '../../models/List';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req;

  // await dbConnect();

  // switch (method) {
  //     case 'PUT' /* Edit a model by its ID */:
  //         try {
  //             const pet = await Pet.findByIdAndUpdate(id, req.body, {
  //                 new: true,
  //                 runValidators: true,
  //             })
  //             if (!pet) {
  //                 return res.status(400).json({ success: false })
  //             }
  //             res.status(200).json({ success: true, data: pet })
  //         } catch (error) {
  //             res.status(400).json({ success: false })
  //         }
  //         break

  //     case 'DELETE' /* Delete a model by its ID */:
  //         try {
  //             const deletedList = await List.deleteOne({ _id: id })
  //             if (!deletedList) {
  //                 return res.status(400).json({ success: false })
  //             }
  //             res.status(200).json({ success: true, data: {} })
  //         } catch (error) {
  //             res.status(400).json({ success: false })
  //         }
  //         break

  //     default:
  //         res.status(400).json({ success: false })
  //         break
  // }
  res.status(200).json({ success: true });
}
