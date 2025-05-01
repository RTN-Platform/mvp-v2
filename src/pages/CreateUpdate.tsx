
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Hash, ImageIcon, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const updateSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters").max(100, "Headline must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  hashtags: z.array(z.string()).default([]),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

const CreateUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hashtagInput, setHashtagInput] = useState("");
  
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      headline: "",
      content: "",
      hashtags: [],
    },
  });
  
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };
  
  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtagInput.includes(' ')) {
      const currentHashtags = form.getValues('hashtags') || [];
      if (!currentHashtags.includes(hashtagInput.trim())) {
        form.setValue('hashtags', [...currentHashtags, hashtagInput.trim()]);
        setHashtagInput("");
      }
    }
  };
  
  const removeHashtag = (hashtag: string) => {
    const currentHashtags = form.getValues('hashtags') || [];
    form.setValue('hashtags', currentHashtags.filter(h => h !== hashtag));
  };
  
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };
  
  const onSubmit = async (data: UpdateFormValues) => {
    try {
      // In a real app, we would upload the image and submit data to an API endpoint
      console.log("Update form submitted:", { ...data, image: selectedImage });
      
      toast({
        title: "Update posted",
        description: "Your update has been successfully posted.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error posting update",
        description: "There was an error posting your update. Please try again.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto py-8">
        <Card className="border-nature-200 shadow-sm">
          <CardHeader className="border-b border-nature-100 bg-nature-50 rounded-t-lg">
            <CardTitle className="text-2xl text-nature-800">Create Update</CardTitle>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a catchy headline for your update" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your thoughts, experiences, or updates..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Image (Optional)</FormLabel>
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <label htmlFor="image-upload" className="cursor-pointer block">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 block mb-1">Click to upload an image</span>
                        <span className="text-xs text-gray-500">JPG, PNG or GIF (Max 5MB)</span>
                        <input 
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={onImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="rounded-lg max-h-[300px] w-full object-cover"
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="hashtags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hashtags</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-grow">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input
                              placeholder="Add hashtags (e.g. nature, hiking)"
                              className="pl-10"
                              value={hashtagInput}
                              onChange={(e) => setHashtagInput(e.target.value)}
                              onKeyDown={handleHashtagKeyDown}
                            />
                          </div>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={addHashtag}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((hashtag, index) => (
                            <span 
                              key={index} 
                              className="bg-nature-100 text-nature-800 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              #{hashtag}
                              <button 
                                type="button" 
                                className="ml-2 text-nature-500 hover:text-nature-700"
                                onClick={() => removeHashtag(hashtag)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-between p-6 border-t border-nature-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-nature-600 hover:bg-nature-700"
                >
                  Post Update
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateUpdate;
