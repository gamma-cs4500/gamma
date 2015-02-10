package com.gatherfriends.gather.NewEvent;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.gatherfriends.gather.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link NameDateTimeFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link NameDateTimeFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class NameDateTimeFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_events, container, false);
    }
}
